import TeamRoom from "layouts/TeamRoom";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

import { useHMSActions, useHMSStore, 
    selectIsConnectedToRoom, selectRoomState, 
    selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, useScreenShare 
} from '@100mslive/react-sdk';

import { useContext, useEffect, useState } from "react";
import { ROLES, TEST_WITHOUT_CONNECTION } from "config/constants";
import Controls from "layouts/Controls";
import { userName } from "common/utils";
import { UserContext } from "common/context";
import RoomConnectionConfig from 'interfaces/RoomConnectionConfig'
import { teamCallKey, teamCallMemberStateKey, teamCallStateKey } from "common/realtimeCallKeys";

import { MemberState, MEMBER_MEETING_STATES, TeamInvitationDataInterface, TEAM_MEETING_STATES } from "interfaces/TeamInvitationDataInterface";

import * as RDB from "firebase/firebaseCallEvents";
import { getRoomToken } from "common/apiRequests";
import { getTeamInfo } from "firebase/firebaseTeam";
import TeamCallInvitation from "components/video/TeamCallInvitation";
import useConstructor from "hooks/useConstructor";
import ScreensharePopup from 'components/screenshare/ScreensharePopup';
import useScreensharing from "hooks/useScreensharing";
import StopSharePopup from "components/screenshare/StopSharePopup";
import { updateTeamMemberCallState } from "common/utils/teamCallUtils";
import { useRequestsStore } from '../common/useRequestsStore';

let counter = 0;

type Params = {
    room: string
    team: string
    company: string
}

function TeamCallPage(props: any){

    // const { room, team, company } = useParams<Params>();
    const params = useParams<Params>()
    const [searchParams, _] = useSearchParams();
    const isRejoining = searchParams.get('rejoin'); // bugs out with rendering main and peers video for some reason
    const autoAccept = !!searchParams.get('autoaccept') || isRejoining;
    const { state } = useLocation();
    const isHost = state?.host == true;
    const { user } = useContext<any>(UserContext);
    const [accepted, setAccepted] = useState(isHost);
    const [busy, setBusy] = useState(false);
    const [teamInfo, setTeamInfo] = useState({});
    const [screensharePopup, toggleScreensharePopup] = useState(false);
    const [stopShareConfirmation, setStopShareConfirmation] = useState(false);
    const navigate = useNavigate();
    const screensharingCtrl = useScreensharing();
    const pendingRedirect = useRequestsStore((state) => state.pendingRedirect);
    const [ready, setReady] = useState(false);
    
    // 100ms
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const roomState = useHMSStore(selectRoomState);
    const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
    const { amIScreenSharing } = useScreenShare();

    //
    useConstructor(init)
    useEffect(onComponentMount, []); // once only
    useEffect(onConnection, [roomState, isConnected])
    useEffect(()=>{
        if(autoAccept && !accepted && ready){
            setTimeout(()=>{
                onAccept();
            }, 1000); // connection delay? doesnt work without timeout
        }
    }, [isConnected, setReady])

    useEffect(()=>{
      if(pendingRedirect){
        removeBeforeUnload();
        onPageClose(); // and expect incomign redirect from AdditionalCallRequest component
      }
    }, [pendingRedirect])


    function onComponentMount(){
        ++counter;
        window.addEventListener('beforeunload', onPageClose); // on mout
        return () => {
            if(amIScreenSharing){
                screensharingCtrl.stop();
            }
            removeBeforeUnload();
        };
    }

    function removeBeforeUnload(){
        window.removeEventListener('beforeunload', onPageClose); // before unmount
    }

    function onConnection(){
        const stopListen = RDB.listen(teamCallKey(String(params.team)), async (data: TeamInvitationDataInterface)=>{
            if(data?.state == TEAM_MEETING_STATES.ended){

                if(pendingRedirect == null){
                    await beforeCallLeave();
                    navigate('/');
                }
            }
        })
        if(isConnected){
            setBusy(false);
        }
        return ()=>{
            if(stopListen) stopListen();
        }
    }
   
    async function init(){

        if(busy){
            console.error('BUSY!', isConnected, roomState)
            return;
        }
        setBusy(true);
        getTeamData();

        if(isHost){
            // person who created room connects as host
            const config = await hostRoleConfig();
            hmsActions.join(config);
        }else{
            // users connect in preview mode with guest role
            const config = await userRoleConfig();
            hmsActions.join(config);
        }
        
    }


    async function getTeamData(){

        // from DB
        const _teamInfo = await getTeamInfo(String(params.company), String(params.team));
        if(_teamInfo){
            setTeamInfo(_teamInfo);
            setReady(true);
        }

    }
    
    async function onAccept() {

        setAccepted(true);
        const newState = isRejoining ? MEMBER_MEETING_STATES.rejoined : MEMBER_MEETING_STATES.accepted;
        updateTeamMemberCallState(newState, String(params.team), user.uid);

        if(!videoEnabled) toggleVideo();
        if(!audioEnabled) toggleAudio();
    }

    async function toggleAudio() {
        try{
          await hmsActions.setLocalAudioEnabled(!audioEnabled);
        }catch(err){
          console.log('rejected audio permissions', err);
          alert('please enable your audio. Click on notification that will appear after closing this popup');
        }
      }
    
      async function toggleVideo() {
        try{
          await hmsActions.setLocalVideoEnabled(!videoEnabled);
        }catch(err){
          console.log('rejected video permissions', err);
        }
      }

    async function onReject(){
        updateTeamMemberCallState(MEMBER_MEETING_STATES.rejected, String(params.team), user.uid);
        beforeCallLeave(false);
        navigate('/');
    }

    async function beforeCallLeave(checkLast: boolean = true): Promise<boolean>{

        if(isConnected) await hmsActions.leave();

        if(checkLast){
            const isLastPerson = await checkLastPerson();
            if(isLastPerson){
                endMeeting();
                return true;
            }
        }
        return false;
    }

    async function checkLastPerson(){
        const meetingStateKey = teamCallKey(String(params.team));
        const inMeetingStates = [
            MEMBER_MEETING_STATES.accepted,
            MEMBER_MEETING_STATES.rejoined,
        ];
        const data = await RDB.read(meetingStateKey);
        if(data && data.state !== TEAM_MEETING_STATES.ended && data.members){
            let inMeeting = Object.keys(data.members).filter((key)=>{
                return inMeetingStates.includes(data.members[key].state)
            })
            return inMeeting.length === 0;
        }
        return false; // state is ended or data not found, in any case - dont update anything
    }
    
    function endMeeting() {
        const meetingStateKey = teamCallStateKey(String(params.team));
        RDB.updateOne(meetingStateKey, TEAM_MEETING_STATES.ended)
    }
    
    function onPageClose(){
        updateTeamMemberCallState(MEMBER_MEETING_STATES.left, String(params.team), user.uid);
        beforeCallLeave();
    }

    async function onLeave() {
        removeBeforeUnload(); 
        updateTeamMemberCallState(MEMBER_MEETING_STATES.left, String(params.team), user.uid);
        await beforeCallLeave();
        navigate('/');
    }

    function onGetTokenError(error: any){
        console.error(new Error(error));
        // TODO - create popup or alert to display error
    }

    async function hostRoleConfig(): Promise<RoomConnectionConfig>{ // use in team meeting. too slow and not fluid to be used in one to one
        const token = await getRoomToken({
            role: ROLES.host, 
            user_id: user.uid, 
            room_id: String(params.room),
        })
        .catch(onGetTokenError);

        return {
            userName: userName(user),
            authToken: String(token),
            settings: {
                isAudioMuted: false,
                isVideoMuted: false,
            },
            rememberDeviceSelection: true,
        }
    }

    // connects muted. when accepts connection - ask to unmute (which will trigger request on browser)
    async function userRoleConfig(): Promise<RoomConnectionConfig>{
        const token = await getRoomToken({
            role: ROLES.user, 
            user_id: user.uid, 
            room_id: String(params.room),
        })
        .catch(onGetTokenError);
        
        return {
            userName: userName(user),
            authToken: String(token),
            settings: {
                isAudioMuted: true,
                isVideoMuted: true,
            },
            rememberDeviceSelection: true,
        }
    }

    function toggleScreenshare(){

        if(!screensharePopup && !amIScreenSharing){
            toggleScreensharePopup(true);
        }else if(amIScreenSharing){
            setStopShareConfirmation(true); // needs confirmation popup and then call stopScreenshare
        }else{
            toggleScreensharePopup(false);
        }
    }
    
    function stopScreenshare(){
        setStopShareConfirmation(false);
        screensharingCtrl?.stop();
    }
    
    return(
        <div className="team-call-page">
            <TeamRoom teamInfo={teamInfo} toggleMinimize={props.toggleMinimize} shouldBlur={stopShareConfirmation}>
                { 
                    accepted || autoAccept
                    ? 
                        <Controls 
                            onLeave={onLeave} 
                            classNames={'sticky'} 
                            toggleScreenshare={toggleScreenshare} 
                            />
                    :
                        <div className="team-call-invitation">
                            <TeamCallInvitation 
                                onAccept={onAccept} 
                                onReject={onReject} 
                                />
                        </div>
                }
            </TeamRoom>

            {/* choose screen to share */}
            {
                screensharePopup && 
                <ScreensharePopup 
                    name={teamInfo?.name} 
                    onClose={toggleScreenshare} 
                    onShare={(screen: any) => screensharingCtrl.start(screen.id)} 
                    />
            }

            {/* confirmation for stopping screen sharing */}
            {
                stopShareConfirmation &&
                <StopSharePopup 
                    onCancel={()=>{ setStopShareConfirmation(false) }} 
                    onSuccess={stopScreenshare} 
                    />
            }
        </div>
    )
}

export default TeamCallPage;