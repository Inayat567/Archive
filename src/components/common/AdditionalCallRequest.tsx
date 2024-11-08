import CenteredPopup from './CenteredPopup';
import { useContext } from 'react';
import { UserContext } from '../../common/context';
import { updateInvitationState } from 'common/utils/privateCallStateManagement';
import { useNavigate } from 'react-router-dom';
import { userName } from 'common/utils';
import { useEffect, useState } from 'react';
import { privateCallKey, teamCallKey } from '../../common/realtimeCallKeys';
import * as RDB from 'firebase/firebaseCallEvents' // firebase realtime database 
import { ROUTES } from 'config/routes';
import { useUserImage } from '../../common/utils/userUtils';
import { updateTeamMemberCallState } from 'common/utils/teamCallUtils';
import { MEMBER_MEETING_STATES, TEAM_MEETING_STATES, TeamInvitationDataInterface } from 'interfaces/TeamInvitationDataInterface';
import {  useHMSStore, selectIsConnectedToRoom } from '@100mslive/react-sdk';
import { useRequestsStore } from 'common/useRequestsStore';
import Loading from 'components/icons/Loading';
import { PRIVATE_MEETING_STATE } from '../../interfaces/PrivateInvitationDataInterface';

export default function AdditionalCallRequest(){

    // const { person, team, room, company } = useRequestsStore((state)=> state.pendingRequest);
    const request: any = useRequestsStore((state)=> state.pendingRequest);

    const requestsStore: any = useRequestsStore()
    const { user } = useContext<any>(UserContext);
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        const stopListen = request.person ? onPrivateInvitation() : 
                            request.team ? onTeamInvitation() : 
                                null;
        return ()=>{
            if(stopListen) stopListen();
            setLoading(false);
        }
    }, []);

    function hideRequestPopup(deleteRequest: boolean = true, deleteRedirect: boolean = false){
        if(deleteRequest) requestsStore.dispatch('pendingRequest', null);
        if(deleteRedirect) requestsStore.dispatch('pendingRedirect', null);
        setLoading(false);
    }

    function onPrivateInvitation(){
        if(user?.uid && request.person?.uid){
            const invitationKey = privateCallKey(user.uid, request.person.uid);
            return RDB.listen(invitationKey, (data: any)=>{
                if(data?.guestState == PRIVATE_MEETING_STATE.left){
                    hideRequestPopup(true, true); 
                }
            });
        }else{
            return null;
        }
    }
    
    function onTeamInvitation(){ // anything specific to listen here? prob only if it goves !live
        return RDB.listen(teamCallKey(request.team.uid), (data: TeamInvitationDataInterface)=>{
            if(data?.state == TEAM_MEETING_STATES.ended){ 
                hideRequestPopup(true, true);
            }
        })
    }

    // only for private
    function onCancel(){
        hideRequestPopup(true, true);
        updateInvitationState(user.uid, request.person.uid, PRIVATE_MEETING_STATE.reject, false);
    }

    // only for private
    async function onAccept(){

        const incomingRoute = ROUTES.getIncomingRoute(request.room, request.person.uid);

        if(isConnected){ // need to wait for disconnect from current call room
            setLoading(true);
            requestsStore.dispatch('pendingRedirect', incomingRoute)
            hideRequestPopup();
            return;
        }else{
            hideRequestPopup();
            setTimeout(()=>{
                navigate(incomingRoute);
            }, 100);
        }
    }

    // for team
    function onTeamCancel(){
        hideRequestPopup(true, true);
        setTimeout(()=>{
            updateTeamMemberCallState(MEMBER_MEETING_STATES.rejected, user.uid, request.team.uid)
        }, 333)
    }

    // for team
    async function onTeamAccept(){
        
        const teamCallRoute = ROUTES.getTeamCallRoute(request.room, request.team.uid, request.company);

        if(isConnected){ // need to wait for disconnect from current call room
            setLoading(true);
            requestsStore.dispatch('pendingRedirect', teamCallRoute);
            hideRequestPopup();
            return;
        }else{
            navigate(teamCallRoute)
            hideRequestPopup(true, true);
        }
    }

    if(request.person){
        return (
            <CenteredPopup 
                classNames='additional-call-request'
                onClose={onCancel} 
                title={`${userName(request.person)} is calling you`}
                image={useUserImage(request.person)}
                message={
                    <>
                        <div>Do you want to accept?</div>
                        <div>You will end your current call</div>
                    </>
                    }
                >
                {
                    loading
                    ?
                        <img src={Loading} />
                    :
                    <>
                        <button onClick={onCancel} className="outlined-light">Decline</button>
                        <button onClick={onAccept} className="green">Accept</button>
                    </>
                }
                
            </CenteredPopup>
        )
    }else if(request.team){
        return (
            <CenteredPopup 
                classNames='additional-call-request'
                onClose={onTeamCancel} 
                title={`${request.team.name} is calling you`}
                message={
                    <>
                        <div>Do you want to accept?</div>
                        <div>You will end your current call</div>
                    </>
                    }
                >
                {
                    loading
                    ?
                        <img src={Loading} />
                    :
                    <>
                         <button onClick={onTeamCancel} className="outlined-light">Decline</button>
                            <button onClick={onTeamAccept} className="green">Accept</button>
                    </>
                }
               
            </CenteredPopup>
        )
    }
    return null;
}