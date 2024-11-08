import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { emailValidation, passwordValidation } from 'common/user';
import { getResetRoute } from 'common/getRedirects';
import Eyelash from 'components/icons/Eyelash';
import { shouldRememberLogin } from 'common/utils/shouldRememberLogin';
import Loading from 'components/icons/Loading';
import EyeClosed from 'components/icons/EyeClosed';

interface Props{
  onSubmit: any;
  theme?: string;
  loading: boolean;
}

function LoginForm(props: Props) {
  const { onSubmit, theme = 'dark', loading } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  useEffect(()=>{
    const remember = shouldRememberLogin();
    if(remember != null){
      setEmail(remember.email);
    }
  }, [])
  
  const isFormValid = () => {
    return emailValidation(email) && passwordValidation(password);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-element">
        <label>Email</label>
        <input
          name="email"
          type="text"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-element">
        <label>Password</label>
        <div className='input-with-icon'>
          <input
            name="password"
            type={passwordVisible ? 'text' : 'password'}
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img src={passwordVisible ? Eyelash : EyeClosed} className="input-icon password-input" onClick={()=>{ setPasswordVisible(!passwordVisible) }} />
        </div>
      </div>
      <div className='flex-spread'>
        <label className={`custom-checkmark ${theme}`}>
          <input type="checkbox" id="remember" name="remember" checked={rememberMe} onChange={()=>{ setRememberMe(!rememberMe)}}/>
          Remember me
        </label>

        <div className='forgot'>
        <Link to={getResetRoute()}>Forgot password?</Link>
        </div>
      </div>
      <div>
        <button type="submit" disabled={!isFormValid() || loading} className={`full with-loader ${loading ? 'loading' : ''}`}>
            <span>Sign in</span>
            <img src={Loading} className='loading-animation'/>
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
