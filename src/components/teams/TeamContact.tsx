import { contactGreen, contactGrey, defaultTeam } from 'components/icons/ContactIcons';
import { Wrapper, Image, Title, Icon, ButtonGreen, ButtonGrey, ButtonBusy, BusyImg} from 'components/styled/contacts/ContactStyle'
import { teamCallKey, teamPresenceKey } from "common/realtimeCallKeys";
import { UserContext } from "common/context";
import useTeamAvailPresence from "hooks/useTeamAvailPresence";
import { useContext, useEffect, useState } from "react";
import * as RDB from 'firebase/firebaseCallEvents'
import ContactAllowed from 'components/icons/contact/ContactAllowed';
import ContactForbidden from 'components/icons/contact/ContactForbidden';
import Loading from 'components/icons/Loading';

interface Props {
  team: any,
  createCall: any,
  joinCall: any,
}

function TeamContact(props: Props) {
  const { team, createCall, joinCall } = props;
  const [busy, setBusy] = useState(false);
  const { user } = useContext<any>(UserContext);
  const [teamPresence, setTeamPresence] = useState([]);
  const [meetingLive, setMeetingLive] = useState(false);
  const available = useTeamAvailPresence(teamPresence, user);

  useEffect(onComponentMount, []);

  function onCreateCall() {
    setBusy(true);
    createCall(team, ()=>{
      setBusy(false);
    });
  }

  function onJoinCall(){
    if(joinCall)
      joinCall(team, meetingLive);
    else
      console.error('join call not defined');
  }

  function onComponentMount(){
      // get team presence
      const stopListener = teamPresenceListener();
      const stopLiveMeetingCheck = checkLiveMeetings();
      return ()=>{
          if(stopListener) stopListener();
          if(stopLiveMeetingCheck) stopLiveMeetingCheck();
      }
  }

  function teamPresenceListener(){
      const teamKey = teamPresenceKey(team.uid);
      return RDB.listen(teamKey, (data: any)=>{
          setTeamPresence(data);
      })
  }

  function checkLiveMeetings(){
    const teamKey = teamCallKey(team.uid);
    return RDB.listen(teamKey, (data: any)=>{
      if(data && data.state == 'live'){
        setMeetingLive(true);
      }else{
        setMeetingLive(false);
      }
    })
  }



  return (
    <Wrapper>
      <Image src={defaultTeam} />
      <Title>
        {team.name}
      </Title>
      {
        busy 
        ?
          <ButtonBusy>
            <BusyImg src={Loading} />
          </ButtonBusy>
        :
          meetingLive
          ?
            <ButtonGreen onClick={onJoinCall}>
              <>
                <Icon src={ContactAllowed} />
                <div className='live-meeting-icon'>1</div>
              </>
            </ButtonGreen>
          :
            available 
            ?
              <ButtonGreen onClick={onCreateCall}>
                <Icon src={ContactAllowed} />
              </ButtonGreen>
            :
            <ButtonGrey>
              <Icon src={ContactForbidden} />
            </ButtonGrey>
      }
     
    </Wrapper>
  );
}

export default TeamContact;
