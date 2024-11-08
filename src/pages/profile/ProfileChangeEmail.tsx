import { PROFILE_ROUTE } from "config/routes";
import ChevronLeft from "components/icons/auth/ChevronLeft";
import { Link } from "react-router-dom";
import { emailValidation } from "common/user";
import { useState } from "react";

export default function ProfileChangeEmail(){

    const [error, setError] = useState('');

    const onSubmit = (event: any) => {
        event.preventDefault();
        const email = event.target.email.value;
        const email2 = event.target.email2.value;

        const valid = validateEmail(email, email2);
        if(valid){
            // TODO - change email? Probably need to send email verification link also
            alert('TODO')
        }
    }

    function validateEmail(email: string, email2: string){

        if(String(email).trim() != String(email2).trim()){
            setError('Emails do not match');
            return false;
        }else if( ! emailValidation(email)){
            setError('Email is not valid');
            return false;
        }

        return true;
    }

    return(
        <div className='profile-page profile-change-email'>
            <div className={"profile-page__size-limiter"}>

                    <div>
                        <h1 className="profile-page__title">Change email</h1>
                    </div>
                   

                     <div className='form-contents'>
                        <form onSubmit={onSubmit}>
                            <div className="form-element">
                                <label>Email</label>
                                <input
                                    name="email"
                                    type="text"
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="form-element">
                                <label>Confirm</label>
                                <input
                                    name="email2"
                                    type="text"
                                    placeholder="Confirm email"
                                />
                            </div>
                            <div>
                                <button type="submit" className='full'>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                    {
                        error != ''
                        ?
                        <div className="profile-page__error">{error}</div>
                        : 
                        null
                    }
                    <div className="auth-page__link-with-icon">
                        <Link to={PROFILE_ROUTE}>
                            <img src={ChevronLeft} />
                            Back
                        </Link>
                    </div>

            </div>
        </div>
        
    )
}