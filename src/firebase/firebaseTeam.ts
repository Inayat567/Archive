import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseApp';
import { TABLE_COMPANIES } from '../config/constants';

export interface TeamInfoInterface{
    uid: string,
    name: string,
    users: string[],
}

export async function getTeamInfo(companyUid: string, teamUid: string): Promise<TeamInfoInterface|null>{
    const teamDoc = await getDoc(doc(db, `${TABLE_COMPANIES}/${companyUid}/teams/${teamUid}`));
    if(teamDoc.exists()){
        return {
            ...teamDoc.data(),
            uid: teamUid
        } as TeamInfoInterface;
    }
    return null;
}