import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import Wave from 'components/icons/Wave';

import { beforeSocialAuth } from 'common/utils/socialAuthUtils';
import { saveRememberMeValue, shouldRememberLogin } from 'common/utils/shouldRememberLogin';
import { authErrorsParser } from 'common/utils/authErrors';
import { getRegisterRoute, resetUsedBefore } from 'common/getRedirects';
import onLoginSubmit from 'common/loginUtils';
import routes, { HOME_ROUTE } from 'config/routes';
import SocialLoginButton from 'components/auth/SocialLoginButton';
import { LOGIN_ROUTE_SMALL } from 'config/routes'
import{ matchRoutes } from 'react-router-dom';

function LoginPageSmall() {

  const { user, setUser } = useContext<any>(UserContext);
  const navigate = useNavigate();
  let resizeTimeout: any = null;
  const remember = shouldRememberLogin();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const onSocialLogin = () => {
    resizeTimeout = beforeSocialAuth();
    const provider = new GoogleAuthProvider();    
    signInWithRedirect(auth, provider)
    setLoading2(true);
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

  function onRegistrationClick(){
    resetUsedBefore();
    setTimeout(()=>{
      navigate(getRegisterRoute())
    }, 100)
  }
  
  return (
    <div className='auth-pages-small login-page-small'>

         <div className='page-limiter'>
          <div className="title-wrapper">
              <h1 className="title">
                Welcome back
                {remember !== null && String(remember.name).length > 0 && ", "+remember.name}
                </h1>
              <img src={Wave} />
            </div>
            <LoginForm onSubmit={onSubmit} loading={loading} />

          <SocialLoginButton onClick={onSocialLogin} loading={loading2} classNames="sm" />

          <div className="auth-page__bottom-link">
            Don't have an account? <button className='button-link' onClick={onRegistrationClick} >Sign Up</button>
          </div>

         </div>
        

    </div>
  );
}

export default LoginPageSmall;