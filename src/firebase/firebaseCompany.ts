import { doc, getDoc, where, collection, query, getDocs, documentId, collectionGroup } from 'firebase/firestore';
import { db } from './firebaseApp';
import { TABLE_COMPANIES } from '../config/constants';
import { CompanyInterface, CompanyTeamInterface, CompanyTeamGetterInterface } from '../interfaces/CompanyInterface';

export async function getCompanyInfo(companyUid: string): Promise<CompanyInterface|null>{
    const companyDoc: any = await getDoc(doc(db, TABLE_COMPANIES, companyUid));
    if(companyDoc.exists()){
        return {
            ...companyDoc.data(),
            uid: companyUid
        };
    }
    return null;
}

export async function getCompanyInfoByInvitationCode(invitationCode: string): Promise<CompanyInterface|null>{
    const companiesRef = collection(db, TABLE_COMPANIES)
    const q = query(companiesRef, where("invitationCode","==", invitationCode))
    const querySnapshot = await getDocs(q);
    if(querySnapshot.size > 0){
        const data: CompanyInterface[] = []
        querySnapshot.forEach((snap) => {
            data.push({
                ...snap.data(),
                uid: snap.id
            } as CompanyInterface)
        })
      return data[0]
    }
    return null
}

function cachedKey(userUid: string){
    return `_cache_teams_${userUid}`
}

function cachedUserTeams(userUid: string){
    const key = cachedKey(userUid)
    try{
        const json = localStorage.getItem(key)
        if(json){
            const {expiry, data} = JSON.parse(json)
            if(Date.now() < expiry){
                return data
            }
        }
        return null
    }catch(err){
        return null;
    }
}

function setCachedUserTeams(userUid: string, data: any){
    const key = cachedKey(userUid)
    const expiry = Date.now() + (5 * 1000); // 5 seconds cache
    localStorage.setItem(key, JSON.stringify({
        expiry,
        data
    }))
}

export async function getTeamsUserBelongsTo(userUid: string, userCompanies: string[]): Promise<CompanyTeamGetterInterface[]>{

    // const cached = cachedUserTeams(userUid)
    // if(!!cached){
    //     return cached
    // }
    
    const companies = await getUserCompaniesData(userCompanies)
    let userTeams: CompanyTeamGetterInterface[] = []
    for await (let company of companies){
        let teams: CompanyTeamGetterInterface[] = await getCompanyTeamsData(company)
        teams.forEach((team: CompanyTeamGetterInterface) => {
            const belongs = team.users.findIndex(uid => uid == userUid) > -1
            if(belongs){
                userTeams.push(team)
            }
        });

        break; // for now just get first company and ignore the rest, it might need grouping by company
    }
    setCachedUserTeams(userUid, userTeams)
    return userTeams;
}

async function getCompanyTeamsData(company: any){
    const q = query(collection(db, `${TABLE_COMPANIES}/${company.uid}/teams`));
    const snapshot = await getDocs(q); // gets companies data
    const data: any[] = []
    snapshot.forEach((snap)=>{
        data.push({
            ...snap.data(),
            uid: snap.id
        })
    })
    return data
}

async function getUserCompaniesData(userCompanies: string[]): Promise<CompanyTeamGetterInterface[]>{
    const q = query(collection(db, TABLE_COMPANIES), where(documentId(), 'in', userCompanies));
    const snapshot = await getDocs(q); // gets companies data
    const companies: CompanyTeamGetterInterface[] = []
    snapshot.forEach((doc)=>{
        const data = doc.data()
        companies.push({
            ...data,
            uid: doc.id
        }as CompanyTeamGetterInterface) 
    }) 
    return companies
}
