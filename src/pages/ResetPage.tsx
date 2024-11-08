import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from 'firebase/firebaseApp';
import AppPreview from 'components/auth/AppPreview';
import Logo from 'components/icons/Logo';
import ForgotIcon from 'components/icons/auth/ForgotIcon';
import { getLoginRoute, getRegisterRoute } from 'common/getRedirects';
import ChevronLeftDark from 'components/icons/auth/ChevronLeftDark';
import ResetPasswordForm from 'components/auth/ResetPasswordForm';

function ResetPage() {
  const navigate = useNavigate();

  const onSubmit = (event: any) => {
    event.preventDefault();
    
    const email = event.target.email.value;
    
    sendPasswordResetEmail(auth, email).then(() => {
      alert('Password reset email sent!');
      navigate(getLoginRoute());
    })
    .catch((error) => {
      alert('Reset error: '+error.message);
    });
  }

  return (
    <div className="auth-page reset-page">

      <div className='page-limiter'>

        <div className="auth-page__form">
          <div className="auth-page__logo">
            <img
                className='photon-logo'
                alt="Photon"
                src={Logo}
              />
          </div>

          <div className="form-contents">
            <div className="title-wrapper with-subtitle">
              <h1 className="form-contents__title ">
                Forgot Password?  
              </h1>
              <img src={ForgotIcon} />
            </div>
            <div className='form-contents__subtitle'>
                We’ll send a link to your email to reset your password
            </div>
            <div className='form-contents'>
              <ResetPasswordForm onSubmit={onSubmit}/>
            </div>
            <div className="auth-page__link-with-icon">
              <Link to={getLoginRoute()}>
                <img src={ChevronLeftDark} />
                Back to Login
              </Link>
            </div>
          </div>

          <div className="auth-page__bottom-link">
            Dont have account? <Link to={getRegisterRoute()}>Sign Up</Link>
          </div>

        </div>

        <AppPreview />
      

      </div>
  </div>
  );
}

export default ResetPage;