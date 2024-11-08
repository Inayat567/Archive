import { useVideo } from '@100mslive/react-sdk';
import { useEffect, useState } from 'react';
import * as RDB from 'firebase/firebaseCallEvents';
import { teamCallMemberStateKey } from '../common/realtimeCallKeys';
import { TEAM_MEETING_STATES, MEMBER_MEETING_STATES } from '../interfaces/TeamInvitationDataInterface';

interface Props{
  peer: any
  talking: boolean
  dominant: boolean
  teamUid: string
}

export default function TeamPeerSmall(props: Props) {

  const { peer, talking, dominant, teamUid } = props;
  const [connected, setConnected] = useState(false);
  const stateKey = teamCallMemberStateKey(teamUid, peer.customerUserId)

  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  useEffect(()=>{
    check();
    const stopListener = listen();
    return ()=>{
      if(stopListener) stopListener();
    }
  }, [])

  function evaluate(state: string){
    if(state == MEMBER_MEETING_STATES.accepted || state == MEMBER_MEETING_STATES.rejoined){
      setConnected(true);
    }
  }

  function check(){
    RDB.readOnce(stateKey, (data: any)=>{
        if(data) evaluate(data);
    })
  }

  function listen(){
      return RDB.listen(stateKey, (data: any)=>{
          if(data) evaluate(data);
      })
  }

  if(connected){
    return (
          <div className='peer-small-video'>
            <video
              ref={videoRef}
              className={`${peer.isLocal ? 'local' : ''}`}
              autoPlay
              muted
              playsInline
            />
          </div>
    );
  }
  return null;
}
