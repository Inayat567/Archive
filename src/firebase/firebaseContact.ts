import { TABLE_USERS } from 'config/constants';
import { collection, getDocs, query, where, documentId, doc, getDoc, collectionGroup } from 'firebase/firestore';
import { db } from './firebaseApp';
import { UserInfoInterface } from '../interfaces/UserInterface';
import { TABLE_COMPANIES } from '../config/constants';

export async function getUsersInCompany(companyUid: string, except: string[] = []){
  const q = query(collection(db, TABLE_USERS), where('companies','array-contains', companyUid))
  const data = await getDocs(q);
  const users: UserInfoInterface[] = []

  data.forEach((doc)=>{
    if(!except.includes(doc.id)){
      users.push({
        ...doc.data(),
        uid: doc.id
      } as UserInfoInterface)
    }
  })

  return users
}

export async function getUsersInTeam(companyUid: string, teamUid: string): Promise<UserInfoInterface[]>{
  // get company
  // get company teams/:uid
  // get users

  const snap = await getDoc(doc(db, TABLE_COMPANIES, `${companyUid}/teams/${teamUid}`));
  if(snap.exists()){
    const team = snap.data()
    const userUids = team.users.map((uid: string) => uid)
    console.log('looking for ', userUids)
    return await getUsersFromUIDs(userUids)
  }
  return []
}

async function getUsersFromUIDs(userUids: string[]): Promise<UserInfoInterface[]>{
  const contacts = [] as any[];
  const q = query(collection(db, TABLE_USERS), where(documentId(), 'in', userUids));
  const usersData = await getDocs(q);
  usersData.forEach((doc)=>{
    if(doc && doc.id){
      let user = doc.data();
      contacts.push({
        ...user,
        uid: doc.id,
      });
    }
  })
  return contacts;
}
