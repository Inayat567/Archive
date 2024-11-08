import { useEffect, useState } from 'react';
import { emailValidation, passwordValidation } from 'common/user';
import Eyelash from 'components/icons/Eyelash';
import { RegisterFormInterface } from 'interfaces/RegisterFormInterface';
import Loading from 'components/icons/Loading';
import EyeClosed from 'components/icons/EyeClosed';
import { PASSWORD_VALIDATION_MESSAGE } from '../../common/user'

const initialForm: RegisterFormInterface = {
  invitationCode: '',
  email: '',
  password: '',
  displayName: '',
  type: ''
}

interface Props{
  handleSubmit: any,
  loading: boolean,
}

function RegisterForm(props: Props) {
  
  const { handleSubmit, loading } = props;
  const [form, setForm] = useState(initialForm);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true)

  useEffect(()=>{
    if(form.password.length > 0){
      setPasswordValid(passwordValidation(form.password))
    }
  }, [form.password])

  function updateForm(key: string, value: string) {
    const newForm = {
      ...form,
      [key]: value,
    };
    setForm(newForm);
  }

  function validateForm() {
    return (
      emailValidation(form.email) &&
      passwordValidation(form.password) &&
      String(form.displayName).trim().length > 0 &&
      String(form.invitationCode).trim().length > 0
    );
  }

  function onSubmit(event: any) {
    handleSubmit(form, event);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className={`form-element`}>
        <label>Company code</label>
        <input
          name="code"
          type="text"
          placeholder="Company code"
          required
          value={form.invitationCode}
          onChange={(e) => updateForm('invitationCode', e.target.value)}
        />
      </div>
      <div className={`form-element`}>
        <label>Email</label>
        <input
          name="email"
          type="text"
          placeholder="Enter email"
          required
          value={form.email}
          onChange={(e) => updateForm('email', e.target.value)}
        />
      </div>
      <div className={`form-element`}>
        <label>Password</label>
        <div className='input-with-icon'>
        <input
          name="password"
          type={passwordVisible ? 'text' : 'password'}
          placeholder="********"
          required
          value={form.password}
          onChange={(e) => updateForm('password', e.target.value)}
        />
        <img src={passwordVisible ? Eyelash : EyeClosed} className="input-icon" onClick={()=>{ setPasswordVisible(!passwordVisible) }} />
        </div>
        {
          !passwordValid && <div className='invalid-input'>{PASSWORD_VALIDATION_MESSAGE}</div>
        }
      </div>
      <div className={`form-element`}>
        <label>Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          required
          value={form.displayName}
          onChange={(e) => updateForm('displayName', e.target.value)}
        />
      </div>
      <div>
        <button type="submit" disabled={!validateForm() || loading} className={`full with-loader ${loading ? 'loading' : ''}`}>
          <span>Create account</span>
          <img src={Loading} className="loading-animation" />
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
