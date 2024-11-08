import { UserContext } from "common/context";
import ChevronLeft from "components/icons/auth/ChevronLeft";
import { PROFILE_ROUTE } from "config/routes";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateUserName } from "firebase/firebaseUser";

export default function ProfileEditName(){

    const { user, setUser } = useContext<any>(UserContext);
    const nameRef = useRef(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        if(user && user.displayName){
            nameRef.current.value = user.name;
        }
    }, [])

    function onSubmit(event: any){
        event.preventDefault();

        const newName = String(event.target.name.value).trim();

        if(newName.length <= 1){
            setError('Name is too short');
            return;
        }

        updateUserName(user.uid, newName)
        .then(()=>{
          setUser({
            ...user,
            name: newName,
          })
          setTimeout(()=>{
            navigate(PROFILE_ROUTE);
          }, 50);
        })
        .catch(err => {
          console.error(err);
          setError(err.message);
        })
    }

 return(
        <div className='profile-page profile-change-name'>
            <div className={"profile-page__size-limiter"}>

                    <div>
                        <h1 className="profile-page__title">Change name</h1>
                    </div>
                    <div className="profile-page__subtitle">
                        Want to change your display name?
                    </div>

                     <div className='form-contents'>
                        <form onSubmit={onSubmit}>
                            <div className="form-element">
                                <label>Name</label>
                                <input
                                    ref={nameRef}
                                    name="name"
                                    type="text"
                                    placeholder="Enter preferred name"
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