import { RegisterFormInterface } from 'interfaces/RegisterFormInterface';
import FinishRegistrationForm from 'components/auth/FinishRegistrationForm';
import Wave from 'components/icons/Wave';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_ROUTE } from 'config/routes';
import { getCompanyInfoByInvitationCode } from 'firebase/firebaseCompany';
import { checkAndUpdateUserCompany } from '../../firebase/firebaseUser';



interface Props{
  userUid: string;
  callback: any;
}

function FinishRegistration(props: Props) {

  const { userUid, callback } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function finalize(form: RegisterFormInterface, event: any) {
    event.preventDefault();

    const company = await getCompanyInfoByInvitationCode(form?.invitationCode);
    if(company === null){
        setErrorMessage('Company code not found');
        return;
    }
    setErrorMessage('');

    console.log('got company?', company)

    const success = await checkAndUpdateUserCompany(userUid, company.uid).catch(handleError);
    if(success){
      if(callback) callback(userUid);
    }else{
      console.error('failed finreg finalization');
    }
  }
  

  function handleError(error: any){
    console.error(error);
    if(error.message) alert(error.message);
  }

  function cancelFinalization(){
    navigate(LOGOUT_ROUTE);
  }

  return (
    <div className="auth-pages-small finish-registration">
        <div className="page-limiter">
          <div className="title-wrapper">
              <h1 className="title">Finish registration</h1>
              <img src={Wave} />
          </div>
          <div className="form-contents">
            <FinishRegistrationForm handleSubmit={finalize} errorMessage={errorMessage} >
                <button type="button" onClick={cancelFinalization} className="full btn-grey">Cancel</button>
            </FinishRegistrationForm>
          </div>
        </div>

    </div>
  );
}

export default FinishRegistration;
