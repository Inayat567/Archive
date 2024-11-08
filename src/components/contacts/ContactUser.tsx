import { useContext, useEffect } from 'react';
import { Wrapper, Title, Icon, ButtonGreen, ButtonGrey } from 'components/styled/contacts/ContactStyle'
import Presense from './Presense';

import { useAvailablePresence, usePresenceListener } from 'hooks/useAvailablePresence';
import ContactIcon from 'components/icons/contact/ContactAllowed';
import ContactProfileImg from './ContactProfileImg';
import { useMissedCall } from 'hooks/useMissedCalls';
import { UserContext } from 'common/context';
import { UserInfoInterface } from '../../interfaces/UserInterface';

interface Props {
  user: UserInfoInterface,
  createCall: any,
}
function ContactUser(props: Props) {
  const { user, createCall } = props;
  const { presenceObj, stopListener } = usePresenceListener(user);
  const isAvailable = useAvailablePresence(presenceObj);

  const currentUser = useContext<any>(UserContext);

  const { missedCall, stopMissedListener } = useMissedCall(currentUser?.user?.uid, user.uid);

  useEffect(onComponentMount, []);

  function onComponentMount(){
    return ()=>{
      if(stopListener) stopListener();
      if(stopMissedListener) stopMissedListener();
    }
  }
    
  return (
    <Wrapper className={!isAvailable ? 'disabled-hovers' : ''} >
      <ContactProfileImg user={user} presenceObj={presenceObj}/>
      <Title>
        {user.name} <Presense presenceObj={presenceObj} />
      </Title>

      {
        isAvailable
        ?
        <ButtonGreen onClick={()=>{ createCall(user) }}>
            <Icon src={ContactIcon} />  
            { missedCall && <div className='live-meeting-icon'>1</div> }
        </ButtonGreen> 
        :
        <ButtonGrey onClick={(e: any)=>{ e.preventDefault() }}>
          <Icon src={ContactIcon} />  
          { missedCall && <div className='live-meeting-icon'>1</div> }
        </ButtonGrey> 
      }    
      
    </Wrapper>   
  );
}

export default ContactUser;
