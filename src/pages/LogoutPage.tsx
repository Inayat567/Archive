import { signOut } from 'firebase/auth';
import { auth } from 'firebase/firebaseApp';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { PresenceContext, UserContext } from 'common/context';
import { PRESENCE_VALUES } from 'common/user';
import { getLoginRoute } from 'common/getRedirects';

export default function LogoutPage(){

    const presenceContext = useContext(PresenceContext); 
    const navigate = useNavigate();
    const { setUser } = useContext<any>(UserContext);

    useEffect(onComponentMount, [])

    function onComponentMount(){

      presenceContext?.changePresence(PRESENCE_VALUES.offline); // if called in callback - throws permission error
      setUser(null);
      signOut(auth).then(()=>{
        navigate(getLoginRoute());
      })
     
      return ()=>{
      }
    }

    return null;
}