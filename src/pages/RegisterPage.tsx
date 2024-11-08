import AppPreview from 'components/auth/AppPreview';
import RegisterForm from 'components/auth/RegisterForm';
import Logo from 'components/icons/Logo';
import Rocket from 'components/icons/auth/Rocket';
import { register } from 'firebase/firebaseAuth';
import { RegisterFormInterface } from 'interfaces/RegisterFormInterface';
import { Link, useNavigate } from 'react-router-dom';
import { getLoginRoute } from 'common/getRedirects';
import { useState } from 'react';
import { saveRememberMeValue } from '../common/utils/shouldRememberLogin'

function RegisterPage() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleRegistration(form: RegisterFormInterface, event: any) {
    event.preventDefault();
    setLoading(true);

    register(form)
      .then((user) => {
        setLoading(false)
        console.log('register', form, user)
        saveRememberMeValue(form.email, form.displayName) // auto enters email that just registered
        navigate(getLoginRoute());
      })
      .catch((error) => {
        setLoading(false)
        alert('Registration error: '+error.message);
      });
  }

  return (
    <div className="auth-page register-page">

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
            <div className="title-wrapper">
              <h1 className="form-contents__title">Create an account</h1>
              <img src={Rocket} />
            </div>
            <RegisterForm handleSubmit={handleRegistration} loading={loading} />
          </div>

          <div className="auth-page__bottom-link">
            Already have an account? <Link to={getLoginRoute()}>Sign In</Link>
          </div>

        </div>

        <AppPreview />
      </div>

    </div>
  );
}

export default RegisterPage;
