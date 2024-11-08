import { useEffect, useState } from 'react';

function FinishRegistrationForm(props: any) {
  
  const { handleSubmit, errorMessage } = props;
  const [form, setForm] = useState({ invitationCode: '' });

  function updateForm(key: string, value: string) {
    const newForm = {
      ...form,
      [key]: value,
    };
    setForm(newForm);
  }

  function validateForm() {
    return (
      String(form.invitationCode).trim().length >= 4
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
      {
          !!errorMessage && errorMessage !== ''
          ?
          <div className='error-message'>Error: { errorMessage }</div>
          :
          null
      }
      <div>
        <button type="submit" disabled={!validateForm()} className="full">Complete</button>
        {
          props?.children && props.children
        }
      </div>
     
    </form>
  );
}

export default FinishRegistrationForm;
