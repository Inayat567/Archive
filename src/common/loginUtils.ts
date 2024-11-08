import { saveRememberMeValue } from 'common/utils/shouldRememberLogin';
import { 
    signInWithEmailAndPassword, 
  } from 'firebase/auth';
  import { userName } from 'common/utils';
import { getFullUser } from 'firebase/firebaseAuth';

export default function onLoginSubmit(event: any, auth: any, onSuccess: any, onError: any){

    event.preventDefault();

    if(event.target.remember.checked){
      saveRememberMeValue(event.target.email.value);
    }else{
      saveRememberMeValue('');
    }

    signInWithEmailAndPassword(
      auth, 
      event.target.email.value, 
      event.target.password.value
      )
    .then(async (result) => {
        if(result.user){

            const fullUser = await getFullUser(result.user);
            
            if(event.target.remember.checked){
                saveRememberMeValue(fullUser.email, userName(fullUser) );
            }else{
                saveRememberMeValue('');
            }
            event.target.reset(); // reset form
            onSuccess(fullUser);
          
        }else{
          console.error('Sign in failed');
          onError({
            message: 'Sign in failed!',
          })
        }
    })
    .catch(onError);

}