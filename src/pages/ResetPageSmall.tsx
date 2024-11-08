import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from 'firebase/firebaseApp';
import ChevronLeft from 'components/icons/auth/ChevronLeft';
import ForgotIcon from 'components/icons/auth/ForgotIcon';
import { getLoginRoute } from 'common/getRedirects';

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
    <div className="auth-pages-small reset-page-small">

      <div className='page-limiter spread'>
          
          <div>
              <div className='title-wrapper'>
                <div className="title">
                  <h1>
                    Forgot Password?  
                  </h1>
                  <img src={ForgotIcon} />
                </div>
              </div>
              <div className='subtitle'>
                  We’ll send a link to your email to reset your password
              </div>

              <div className='form-contents'>
                <form onSubmit={onSubmit}>
                  <div className="form-element">
                    <label>Email</label>
                    <input
                      name="email"
                      id="email"
                      type="text"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <button type="submit" className='full'>
                      Send reset link
                    </button>
                  </div>
                </form>
              </div>
          </div>

          <div className="link-with-icon">
            <Link to={getLoginRoute()}>
              <img src={ChevronLeft} />
              Back to Login
            </Link>
          </div>

      </div>   

  </div>
  );
}

export default ResetPage;