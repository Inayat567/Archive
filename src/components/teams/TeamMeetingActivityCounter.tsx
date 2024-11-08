import TeamJoined from 'components/icons/calls/TeamJoined';
import TeamAbsent from 'components/icons/calls/TeamAbsent';
import { useEffect, useState } from 'react';
import * as RDB from "firebase/firebaseCallEvents";
import { teamCallKey } from 'common/realtimeCallKeys';
import { MEMBER_MEETING_STATES } from 'interfaces/TeamInvitationDataInterface';
import { selectIsConnectedToRoom, useHMSStore } from '@100mslive/react-sdk';

interface Props{
    teamUid: string,
}

interface CountPeersInterface{
    joined: number,
    absent: number,
}

const initialCounter: CountPeersInterface = {
    joined: 0,
    absent: 0,
}  

export default function TeamMeetingActivityCounter(props: Props){

    const [countPeers, setCountePeers] = useState(initialCounter); 
    const [initialized, setInitialized] = useState(false);
    
    // 100ms
    const isConnected = useHMSStore(selectIsConnectedToRoom);

    useEffect(()=>{
        if(isConnected){
            teamPresenceCheck();
        }
    }, [isConnected]);

    useEffect(()=>{
        const stopListener = teamPresenceListener();
        return ()=>{
            if(stopListener) stopListener();
        }
    }, [])

    // need to get it once and then depend on listener
    function teamPresenceCheck(){
        if(!initialized){
            RDB.read(teamCallKey(props.teamUid))
            .then( (data: any)=>{
                if(data){
                    setInitialized(true);
                    onChange(data);
                }
            })
            .catch(err => {
                // no data available
            })
        }
    }

    function teamPresenceListener(){
        return RDB.listen(teamCallKey(props.teamUid), (data)=>{
            if(data){
                onChange(data);
            }
        });
    }

    function onChange(data: any){

        let sum = {
            joined: 0,
            absent: 0,
        }

        const inMeeting = [
            MEMBER_MEETING_STATES.accepted,
            MEMBER_MEETING_STATES.rejoined
        ]

        if(data && data.members){
            Object.entries(data.members).forEach(([_, member])=>{
                if(inMeeting.includes(member.state)){
                    sum.joined += 1;
                }else{
                    sum.absent += 1;
                }
            })
        }
        
        setCountePeers(sum);
    }


    return (
        <>
             <div className='team-state__joined'>
                <img src={TeamJoined} className="team-state-icon" />
                Joined:
                <div className='members-counter'>
                  <span>{ countPeers.joined > 0 && countPeers.joined }</span>
                </div>
            </div>
            <div className='team-state__absent'>
                <img src={TeamAbsent} className="team-state-icon" />
                Absent:
                <div className='members-counter'>
                  <span>{ countPeers.absent > 0 && countPeers.absent }</span>
                </div>
            </div>
        </>
    )

}