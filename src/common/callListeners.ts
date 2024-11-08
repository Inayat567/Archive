import { teamCallKey, allPrivateCallsKey } from './realtimeCallKeys';
import * as RDB from 'firebase/firebaseCallEvents'
import { TEAM_MEETING_STATES } from '../interfaces/TeamInvitationDataInterface';
import { PRIVATE_MEETING_STATE } from '../interfaces/PrivateInvitationDataInterface';
import { getTeamsUserBelongsTo } from 'firebase/firebaseCompany';
import { CompanyTeamInterface, CompanyTeamGetterInterface } from '../interfaces/CompanyInterface';


export  function privateCallListener(user: any, callback: any){
    const invitationKey = allPrivateCallsKey(user.uid); 
    // return RDB.listen(invitationKey, (data: any)=>{
    return RDB.listenForNew(invitationKey, (dataObj: any)=>{
      if(dataObj.guestState == PRIVATE_MEETING_STATE.invite){
        callback(dataObj);
      }
    });
}

  export async function multiTeamListener(user: any, callback: any): Promise<any[]>{

    const listeners: any[] = [];
    const teams = await getTeamsUserBelongsTo(user.uid, user.companies)
    teams.forEach((team: CompanyTeamGetterInterface)=>{
        let listener = teamCallListener(team.uid, callback);
        if(listener)
          listeners.push(listener)
    })
    return Promise.resolve(listeners);
  }

  function teamCallListener(teamUid: string, callback: any){
      const teamKey = teamCallKey(teamUid);
      return RDB.listen(teamKey, (data: any)=>{
        if(data?.state == TEAM_MEETING_STATES.live){
            callback(data);
        }
      });
  }