import { TABLE_USERS } from 'config/constants';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseApp';
import { saveUserWithoutCompany } from 'firebase/firebaseAuth';
import { UserInfoInterface, FullUserInterface, UserInterface, FirestoreUserInterface } from '../interfaces/UserInterface';
import { USER_VERSION } from '../config/constants';



export async function getUserInfo(userUid: string): Promise<UserInfoInterface|null>{
 
    const snap = await getDoc(doc(db, TABLE_USERS, userUid));
    if(snap.exists()){
        return {
            ...snap.data(),
            uid: userUid,
        } as UserInfoInterface
    }
    return null;
}

function validateUserName(name: string){
    let valid = true;
    if(String(name).trim().length === 0) valid = false;
    return valid;
}

export function updateUserName(userUid: string, name: string): Promise<any>{
    const valid = validateUserName(name);
    if(valid){
      const userRef = doc(db, TABLE_USERS, userUid)
      return updateDoc(userRef, {
        name,
      });
    }
    return Promise.reject({
      message: 'Enter name',
      error: 'Validation failed',
    });
}

export function updateUserImage(userUid: string, imagePath: string): Promise<any>{
    const userRef = doc(db, TABLE_USERS, userUid);
    return updateDoc(userRef, {
        customImage: imagePath,
    });
}

export async function registerSocialUser(fullUser: FirestoreUserInterface, type='google'){

    const userObj: UserInterface = {
        name: fullUser.displayName,
        email: fullUser.email,
        type,
        companies: [],
        version: USER_VERSION
    }

    return saveUserWithoutCompany(fullUser.uid, userObj);
}

export function checkAndUpdateUserCompany(userUid: string, companyUid: string){
    return new Promise(async (resolve, reject)=>{

        const user = await getUserInfo(userUid);
        const exists = user?.companies.filter((userCompany)=> userCompany == companyUid).length

        if(!exists && user != null){
            const updateObj = user.companies.length > 0  
            ?
            { companies: arrayUnion(companyUid) } // needed when user companies array is not empty!
            :
            { companies: [companyUid] };

            const userRef = doc(db, TABLE_USERS, userUid);
            await updateDoc(userRef, updateObj)
            .catch(error => {
                reject({
                    message: 'Failed updating user companies',
                    error,
                })
            })
        }
        
        resolve(true)
    })
}

export async function validateUserRegistration(fullUser: FullUserInterface): Promise<any>{
    // with social login we're missing team information and ser is not saved into firestore
    console.log('## IS VALID USER?', fullUser.companies, fullUser.uid, fullUser);

    if(fullUser?.companies?.length > 0){
        console.log('## VALID 1', fullUser?.teams.length);
        return true;
    }

    // 1. check if user information exists in database
    // 2. check if user has team assigned
    const _user = await getUserInfo(fullUser.uid);
    if(!_user){
        console.log('## INVALID 2')
        return null;
    }
    if(_user && _user.companies && _user.companies.length == 0){
        console.log('## INVALID 3')
        return false;
    }

    console.log('## VALID - USER', fullUser)
    return true;
}
