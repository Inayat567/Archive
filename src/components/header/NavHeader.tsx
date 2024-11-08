import { UserContext } from 'common/context';
import { MinimizeArrow } from 'components/common/MinimizeArrow';
import Logo from 'components/icons/Logo';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderProfilePicture from './HeaderProfilePicture';

export default function NavHeader(props: any) {
  const {user} = useContext<any>(UserContext); 
  return (
    <header className="nav-header">
      <Link to='/'>
        <img
          className='photon-logo__small'
          alt="Photon"
          src={Logo}
        />
      </Link>
      <div className="nav-header__right">
        {user ? 
          <>
            <HeaderProfilePicture />
            <MinimizeArrow toggleMinimize={props.toggleMinimize} theme={'dark'} />
          </>
          :
          <div className="TODO-adjust-minimization-arrow">
            <MinimizeArrow toggleMinimize={props.toggleMinimize} theme={'dark'} />
          </div>
        }
      </div>
    </header>
  );
}
