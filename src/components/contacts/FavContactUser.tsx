import { Wrapper } from 'components/styled/contacts/ContactStyle';
import { useContext, useEffect } from 'react';

import { UserContext } from 'common/context';
import { useAvailablePresence, usePresenceListener } from 'hooks/useAvailablePresence';
import { useMissedCall } from 'hooks/useMissedCalls';
import { UserInfoInterface } from '../../interfaces/UserInterface';
import FavContactProfileImg from './FavContactProfileImg';

interface Props {
  user: UserInfoInterface;
  createCall: any;
}
function FavContactUser(props: Props) {
  const {user, createCall} = props;
  const {presenceObj, stopListener} = usePresenceListener(user);
  const isAvailable = useAvailablePresence(presenceObj);

  const currentUser = useContext<any>(UserContext);

  const {missedCall, stopMissedListener} = useMissedCall(currentUser?.user?.uid, user.uid);

  useEffect(onComponentMount, []);

  function onComponentMount() {
    return () => {
      if (stopListener) stopListener();
      if (stopMissedListener) stopMissedListener();
    };
  }

  return (
    <Wrapper className={!isAvailable ? 'disabled-hovers' : ''}>
      <div className="fav-contact-div">
        <div>
        <FavContactProfileImg
          user={user}
          presenceObj={presenceObj}
          onClick={() => {
            isAvailable ? 
            createCall(user):'';
            
          }}
        />
        {missedCall && <div className="live-meeting-icon">1</div>}
      </div>
      <div className="fav-contact-name">{user?.name}</div>
      </div>

    </Wrapper>
  );
}

export default FavContactUser;
