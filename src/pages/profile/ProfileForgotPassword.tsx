import { UserContext } from "common/context";
import ResetPasswordForm from "components/auth/ResetPasswordForm";
import { sendPasswordResetEmail } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { auth } from 'firebase/firebaseApp';
import { PROFILE_ROUTE } from "config/routes";
import ChevronLeft from "components/icons/auth/ChevronLeft";
import { Link } from "react-router-dom";

export default function ProfileForgotPassword(){

    const {user} = useContext<any>(UserContext);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(()=>{
        if(user){
            setEmail(user.email);
        }
    }, []);

    const onSubmit = (event: any) => {
        event.preventDefault();
        
        const email = event.target.email.value;

        sendPasswordResetEmail(auth, email).then(() => {
            setMessage('Password reset link sent to email!');
            setEmail('');
        })
        .catch((error) => {
            if(error?.message.includes('auth/missing-email')){
                setError('Enter valid email address');
            }else{
                setError(error.message);
            }
        });
      }
    return(
        <div className='profile-page profile-forgot-password'>
            <div className={"profile-page__size-limiter"}>

                    <div>
                        <h1 className="profile-page__title">Forgot password?</h1>
                    </div>
                    <div className="profile-page__subtitle">
                        We’ll send a link to your email to reset your password
                    </div>

                    <ResetPasswordForm onSubmit={onSubmit} email={email} />

                    {
                        message != ''
                        ?
                        <div className="profile-page__message">{message}</div>
                        : 
                        null
                    }
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