import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from 'common/context';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth } from 'firebase/firebaseApp';

import LoginForm from 'components/auth/LoginForm';
import { getFullUser } from 'firebase/firebaseAuth';
import AppPreview from 'components/auth/AppPreview';
import Logo from 'components/icons/Logo';
import Wave from 'components/icons/Wave';
import { getRegisterRoute } from 'common/getRedirects';
import GoogleIcon from 'components/icons/auth/GoogleIcon';
import { beforeSocialAuth } from 'common/utils/socialAuthUtils';
import { authErrorsParser } from 'common/utils/authErrors';
import routes, { HOME_ROUTE, LOGIN_ROUTE } from 'config/routes'
import onLoginSubmit from 'common/loginUtils';
import SocialLoginButton from 'components/auth/SocialLoginButton';
import{ matchRoutes } from 'react-router-dom';

function LoginPage() {

  const { setUser } = useContext<any>(UserContext);
  const navigate = useNavigate();
  let resizeTimeout: any = null;
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const onSocialLogin = () => {
    setLoading2(true);
    resizeTimeout = beforeSocialAuth();
    const provider = new GoogleAuthProvider();    
    signInWithRedirect(auth, provider);
    setTimeout(()=>{
      setLoading2(false);
    }, 5000)
  }

  const onSubmit = (event: any) => {
    setLoading(true);
    onLoginSubmit(event, auth, onLoginSuccess, onLoginError);
  }

  function onLoginError(error: any){
    const errMsg = authErrorsParser(error);
    setLoading(false);
    alert(errMsg);
  }

  async function onLoginSuccess(fullUser: any){
    setUser(fullUser);
    setTimeout(()=>{
      setLoading(false);
      navigate(HOME_ROUTE);
    }, 100);
  }

  return (
    <div className={`auth-page login-page`}>

      <div className="page-limiter">

        <div className="auth-page__form">
          <div className="auth-page__logo">
            <img
                className='photon-logo'
                alt="Photon"
                src={Logo}
              />
          </div>

          <div className="form-contents">
            <div className="title-wrapper">
              <h1 className="form-contents__title">Welcome</h1>
              <img src={Wave} />
            </div>
            <LoginForm onSubmit={onSubmit} theme={'light'} loading={loading} />
            <SocialLoginButton onClick={onSocialLogin} loading={loading2} />
          </div>

          <div className="auth-page__bottom-link">
            Don't have an account? <Link to={getRegisterRoute()}>Sign Up</Link>
          </div>

        </div>
        <AppPreview />     

      </div>
    </div>
  );
}

export default LoginPage;