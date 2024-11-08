import { Link, useNavigate } from 'react-router-dom';
import { useContext,  } from 'react';
import { UserContext } from 'common/context';
import ProfileImage from 'components/profile/ProfileImage';
import StatusDot from 'components/profile/StatusDot';

export default function HeaderProfilePicture() {
  
  const { user } = useContext<any>(UserContext);

  return (
    <div className='header-profile'>     
        <Link to='/profile' className='header-profile__link'>
          <ProfileImage user={user} />
          <StatusDot classNames={'profile-status-dot'} />
        </Link>
    </div>
  );
}
