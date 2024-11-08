import { signOut } from 'firebase/auth';
import { auth } from 'firebase/firebaseApp';
import { defaultContact } from '../../components/icons/ContactIcons';

export async function clearPreviousAuth(){
    await signOut(auth);
    return true;
}

export function useUserImage(user: any){
    return user.customImage ? user.customImage : 
            user?.providerData?.photoURL ? user.providerData.photoURL :
                user.photoURL ? user.photoURL :
                defaultContact;
}
