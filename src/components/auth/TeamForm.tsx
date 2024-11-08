import { useEffect, useState } from 'react';
import { emailValidation, passwordValidation } from 'common/user';
import Eyelash from 'components/icons/Eyelash';

interface RegisterFormInterface{
  team: string,
  email: string,
  password: string,
  displayName: string,
  type: string, // google
}

const initialForm: RegisterFormInterface = {
  team: '',
  email: '',
  password: '',
  displayName: '',
  type: ''
}

function RegisterForm(props: any) {
  
  const { handleSubmit } = props;
  const [form, setForm] = useState(initialForm);
  const [passwordVisible, setPasswordVisible] = useState(false);

  function updateForm(key: string, value: string) {
    const newForm = {
      ...form,
      [key]: value,
    };
    setForm(newForm);
  }

  function validateForm() {
    // TODO - add proper validation for email
    return (
      emailValidation(form.email) &&
      passwordValidation(form.password) &&
      String(form.displayName).trim().length > 0 &&
      String(form.team).trim().length > 0
    );
  }

  function onSubmit(event: any) {
    handleSubmit(form, event);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-element">
        <label>Company code</label>
        <input
          name="code"
          type="text"
          placeholder="Company code"
          required
          value={form.team}
          onChange={(e) => updateForm('team', e.target.value)}
        />
      </div>
      <div className="form-element">
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
      <div className="form-element">
        <label>Password</label>
        <div className='input-with-icon'>
        <input
          name="password"
          type={passwordVisible ? 'text' : 'password'}
          placeholder="****"
          required
          value={form.password}
          onChange={(e) => updateForm('password', e.target.value)}
        />
        <img src={Eyelash} className="input-icon" onClick={()=>{ setPasswordVisible(!passwordVisible) }} />
        </div>
      </div>
      <div className="form-element">
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
        <button type="submit" disabled={!validateForm()} className="full">
          Create account
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
