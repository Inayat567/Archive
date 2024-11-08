import { CAN_REGISTER_WITHOUT_TEAM, TABLE_USERS } from 'config/constants';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {auth} from 'firebase/firebaseApp';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { RegisterFormInterface } from 'interfaces/RegisterFormInterface';
import { db } from './firebaseApp';
import { getCompanyInfo, getCompanyInfoByInvitationCode } from './firebaseCompany';
import { USER_VERSION } from '../config/constants';

export function register(form: RegisterFormInterface) {
  return new Promise(async (resolve, reject) => {

    if( ! CAN_REGISTER_WITHOUT_TEAM){
      const companyExists = await getCompanyInfoByInvitationCode(form.invitationCode);
      if(!companyExists){
        return reject({
          message: `Invitation code not found.`
        })
      }
    }

    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then(async (userCredential) => {
        // Signed in
        const { user } = userCredential;

        // save user in firestore for easy access
        // TODO - check if email already registered (maybe it was gmail auth?)
        await saveUserOnFirestore(user.uid, form).catch((err: any) => {
          reject(err);
        });

        resolve(user);
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        reject(error);
      });
  });
}

export async function saveUserOnFirestore(uid: string, form: RegisterFormInterface) {

  const company = await getCompanyInfoByInvitationCode(form.invitationCode)

  const data = {
    email: form.email,
    name: form.displayName,
    companies: company ? [company.uid] : [],
    version: USER_VERSION
  };
  return setDoc(doc(db, TABLE_USERS, uid), data); // promise
}

// used for social logins
export async function saveUserWithoutCompany(userUid: string, data: any){
  return setDoc(doc(db, TABLE_USERS, userUid), data);
}


export async function getFullUser(authUser: any, setCallback: any|undefined = undefined){

    const userDoc = await getDoc(doc(db, TABLE_USERS, authUser.uid));
    const user = userDoc.exists() ? userDoc.data() : { teams: [] };

    const fullUser = {
      ...authUser,
      ...user, // contains teams and name
    }

    if(setCallback) return setCallback(fullUser);
    return fullUser;
}