import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'common/context';
import { ROLES, TEST_WITHOUT_CONNECTION } from 'config/constants';
import { useNavigate, useParams } from 'react-router-dom';
import * as RDB from 'firebase/firebaseCallEvents' // firebase realtime database 
import styled from 'styled-components'

import {
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectRemotePeers,
  useHMSActions,
  useHMSStore,
} from '@100mslive/react-sdk';
import PrivateRoom from 'layouts/PrivateRoom';
import { userName } from 'common/utils';
import { InvitationStateType, PrivateInvitationDataInterface } from 'interfaces/PrivateInvitationDataInterface';
import { privateCallKey } from 'common/realtimeCallKeys';
import Controls from 'layouts/Controls';
import ProfilePhoto from 'components/common/ProfilePhoto';
import LocalPreview from 'layouts/LocalPreview';
import { createRoom, getRoomToken } from 'common/apiRequests';
import { BusyImg } from 'components/styled/contacts/ContactStyle';
import useConstructor from 'hooks/useConstructor';
import Loading from 'components/icons/Loading';
import { checkForMissedCall, removeMissedCall, setMissedCall } from 'hooks/useMissedCalls';
import { getUserInfo } from 'firebase/firebaseUser';
import { setLastInteraction } from 'interfaces/LastInteractionHandler';
import { MinimizeArrow } from 'components/common/MinimizeArrow';
import { updateInvitationState } from 'common/utils/privateCallStateManagement';
import { HOME_ROUTE } from 'config/routes';
import { useRequestsStore } from '../common/useRequestsStore';
import { PRIVATE_MEETING_STATE } from '../interfaces/PrivateInvitationDataInterface';
import { UserInfoInterface } from '../interfaces/UserInterface';

const WaitingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
`

const PersonLinked = styled.h2`
  margin-top: 10px;
  color: white;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
`

const WaitingResponse = styled.div`
  margin-top: 10px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
`

const Center = styled.div`
  position: absolute;
  top: calc(50% - 20px);
  left: 50%;
  transform: translate(-50%, -50%);
`

const Bottom = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
`

interface JoinConfigInterface {
  userName: string,
  authToken: string,
  settings?: { 
    isAudioMuted?: boolean,
    isVideoMuted?: boolean
  },
  metaData?: string,
  rememberDeviceSelection?: boolean,
  captureNetworkQualityInPreview?: boolean,
}

interface Props{
  toggleMinimize: any,
}

type Params = {
  inviteeUid: string;
}

function OutgoingCallPage(props: Props) {
  
  const { user } = useContext<any>(UserContext);
  const params = useParams<Params>(); // id as user.uid
  const [invitee, setInvitee] = useState<UserInfoInterface|null>(null);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [wasInvited, setWasInvited] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomToken, setRoomToken] = useState('');
  const [showPreview, setShowPreview] = useState(false); // TODO - only show on testing environment
  const navigate = useNavigate();
  const [guestState, setGuestState] = useState('');
  const pendingRedirect = useRequestsStore((s:any)=> s.pendingRedirect);
  const [ready, setReady] = useState(false);
  const [inviteeState, setInviteeState] = useState<string|null>(null)

  // 100ms
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const peers = useHMSStore(selectRemotePeers);


  useConstructor(init);
  useEffect(onComponentMount, []);
  useEffect(onConnection, [isConnected, roomId]); // roomId lags behind
  useEffect(onPeersChange, [peers])
  useEffect(watchState, [guestState, initiated])
  useEffect(()=>{
    if(pendingRedirect != null && ready){
      // alert('F');
      removeBeforeUnload();
      onPageClose(); // and expect incomign redirect from AdditionalCallRequest component
    }
  }, [pendingRedirect])

  function watchState(){
    setTimeout(()=>{
      if(initiated && guestState == PRIVATE_MEETING_STATE.left && pendingRedirect === null){
        onLeave(PRIVATE_MEETING_STATE.left, true);
      }
    },100);
  }

  function onComponentMount(){
    
    const stopListener = listenForResponse();
    window.addEventListener('beforeunload', ()=>{ onPageClose() });

    return () => {
      if(stopListener) stopListener();
      removeBeforeUnload();
    };
  }

  function removeBeforeUnload(){
    window.removeEventListener('beforeunload', ()=>{ onPageClose() });
  }

  function listenForResponse(){
    const key = privateCallKey(params.inviteeUid, user.uid)
    return RDB.listen(key, (data: PrivateInvitationDataInterface)=>{

      switch(data?.guestState){
        case 'accept':
          setGuestState(data.guestState);
          onAcceptedCallback(data);
          break;

        case 'reject':
          setGuestState(data.guestState);
          onRejectedCallback(data);
          break;

        case 'left':
          setGuestState(data.guestState);
          break;
      }

      if(data?.guestState in PRIVATE_MEETING_STATE){
        setInviteeState(data.guestState);
      }
    })
  }

  function onConnection(){

    if(TEST_WITHOUT_CONNECTION) return;

    if(isConnected && roomId != ''){

      if(!audioEnabled) toggleAudio();
      if(!videoEnabled) toggleVideo();

      if(!accepted && !wasInvited){
          setWasInvited(true);
          inviteOnConnection();
      }else{
        console.log('skipping invitation, because: ', accepted, wasInvited, roomId);
      }
    }else if(isConnected && roomId == ''){
      console.log('waiting for roomiD update...', roomId);
    }else{
      console.log('NOT CONNECTED', isConnected, roomId);
    }
  }

  function updateCreatorState(newState: InvitationStateType){
    updateInvitationState(String(params.inviteeUid), user.uid, newState, true);
  }

  function onPeersChange(){
    // console.log('peers', peers);
  }

  function onRejectedCallback(data: any){
    setRejected(true);
    onLeave(PRIVATE_MEETING_STATE.left)
  }

  function onAcceptedCallback(data: any){
    setAccepted(true);
    checkPreviouslyMissedCallsFromPerson(String(params.inviteeUid));
  }

  /*
    delete invitation when
    1. rejected
    2. accepted, but leaving
    3. invite accepted, but leaving
  */

  async function init() {

    await getInviteeInfo().catch(console.error);  
    setLastInteraction(user.uid, String(params.inviteeUid));

    // 1. create room
    const _roomId = await createRoom(getPrivateRoomParams()).catch(err => {
      console.error(err)
      // if(err?.error.message.includes('duplicate entry')) ???
      throw new Error('Failed creating private room')
    });
    if(_roomId) setRoomId(_roomId);

    // 2. receive token
    const _roomToken = await getRoomToken({
      role: ROLES.user, 
      user_id: user.uid, 
      room_id: _roomId,
    })
      .catch(err => {
        console.error(err);
        throw new Error('Failed at getting room token');
      });

    // 3. join room
    if(_roomToken){
      setRoomToken(_roomToken);     
      joinVideoRoom(_roomToken)
      .then(()=>{
        console.log('joined room');
      })
      .catch(err => {
        console.error('connection failed', err);
      }) 
    }

    setReady(true);
  }

  // if there was a missed call FROM this person
  // and user connected back to him/her
  // then remove previuosly missed call data
  function checkPreviouslyMissedCallsFromPerson(inviter: string){
    checkForMissedCall(inviter, user.uid)
    .then((val)=>{
      if(val > 0){
        removeMissedCall(inviter, user.uid);
      }
    })
    .catch(err => {
      if(err != null){
        console.error('MISSED CALL ERROR?', err);
      }
    })
  }

  function getPrivateRoomParams(){
    // params.inviteeUid is the person who is being invited
    return {
      // room: `private_${params.inviteeUid}`
      room: `private_${partFrom(params.inviteeUid)}_${partFrom(user.uid)}`
    }

    function partFrom(str: string){
      return str.slice(0,5)+''+str.slice(str.length-5, str.length);
    }
  }

  function getInviteeInfo(){

    if(! invitee?.uid){
      setInvitee(
        {
          uid: String(params.inviteeUid),
          email: '',
          displayName: '',
        }
      )
    }
    
    return new Promise((resolve, reject)=>{
      getUserInfo(params.inviteeUid).then((data)=>{
        if(data){
          setInvitee(data);
          resolve(1);
        }else{
          reject({
            error:{
              message: 'No data found for invitee #'+params.inviteeUid,
            }
          });
        }
      })
      .catch(err => {
        reject(err);
      })
    })
  }

  function inviteOnConnection(){
    inviteViaRD(String(params.inviteeUid), String(roomId));
  }

  function inviteViaRD(inviteeUid: string, roomId: string){ // invite via realtime database
    const key = privateCallKey(inviteeUid, user.uid);
    const data: PrivateInvitationDataInterface = {
      name: userName(user),
      room: roomId,
      timestamp: Date.now(),
      createdBy: user?.uid,
      creatorState: PRIVATE_MEETING_STATE.accept,
      guestState: PRIVATE_MEETING_STATE.invite,
      company: user.companies[0]
    };
    RDB.updateOne(key, data)
    .then(()=>{
      setInitiated(true);
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  function joinConfig(authToken: string = roomToken): JoinConfigInterface{
    return {
      userName: userName(user),
      authToken,
      settings: { // initial states
        isAudioMuted: false,
        isVideoMuted: false
      },
      // metaData: JSON.stringify({ city: 'Winterfell', knowledge: 'nothing' }),
      rememberDeviceSelection: false, // remember manual device change (kinda buggy when testing on multiple browsers)
      // captureNetworkQualityInPreview: false // whether to measure network score in preview
    }
  }

  function joinVideoRoom(token: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const config = joinConfig(token);
        await hmsActions.join(config);
        resolve(1);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
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

  function onLeave(newState: InvitationStateType = PRIVATE_MEETING_STATE.left, skipMissed: boolean = false) {

    removeBeforeUnload();
    updateCreatorState(newState);

    if(!accepted && !rejected && !skipMissed){ // didnt get response, but invitee might be in room, so update state only
      setMissedCall(String(params.inviteeUid), user.uid);
    }
    if(isConnected) hmsActions.leave();
    setTimeout(()=>{
      navigate(HOME_ROUTE);
    }, 100);
  }

  function onPageClose(){
    updateCreatorState(PRIVATE_MEETING_STATE.left)
    if(isConnected) hmsActions.leave();
  }


  return (
    <div className={`outgoing-call-page`}>

        { accepted 
          ? 
            <PrivateRoom 
              visible={true} 
              accepted={accepted} 
              onLeave={()=>{onLeave()}}
              toggleMinimize={props.toggleMinimize}
              person={invitee}
            ></PrivateRoom>
          :
          <WaitingWrapper >

            {/* localpreview temp for testing */}
            { showPreview 
              ?
              <LocalPreview visible={!accepted}>
                  <button onClick={()=>{setShowPreview(false)}} className='dark xs'>Hide preview</button>
              </LocalPreview>
              :
              null
            }
            <MinimizeArrow toggleMinimize={props.toggleMinimize} theme={'light'} />
            <Center>
              <div className='waiting-response'>
                <ProfilePhoto user={invitee} />
                { isConnected 
                  ?
                    inviteeState == PRIVATE_MEETING_STATE.joined
                    ?
                    <>
                      <PersonLinked>Person is now linked with you</PersonLinked>
                      <WaitingResponse>Waiting for response</WaitingResponse>
                    </>
                    :
                    <>
                      <PersonLinked>Invitee is connecting...</PersonLinked>
                      <WaitingResponse>&nbsp;</WaitingResponse>
                    </>
                 
                  :
                  <>
                    <PersonLinked>Connecting...</PersonLinked>
                    <WaitingResponse>&nbsp;</WaitingResponse>
                  </>
                }
              </div>
            </Center>
            <Bottom>
              {
                isConnected
                ?
                <Controls onLeave={()=>{onLeave()}} classNames={'relative'} />
                :
                <div className='control-bar relative'>
                  <div className='actions'>
                    <BusyImg src={Loading} />
                  </div>
                </div>
              }
              
            </Bottom>
          </WaitingWrapper>  
        }     
    </div>
  );
}

export default OutgoingCallPage;
