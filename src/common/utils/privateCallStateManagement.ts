import { privateCallKey } from "common/realtimeCallKeys";
import * as RDB from 'firebase/firebaseCallEvents' // firebase realtime database 
import { InvitationStateType, PrivateInvitationDataInterface } from 'interfaces/PrivateInvitationDataInterface';

// TODO - add state of invitee and inviter?
// or add states for both like, connecting, connected, disconnected
export async function updateInvitationState(inviteeUid: string, inviterUid: string, newState: InvitationStateType, isCreator: boolean){

  const invitationKey = privateCallKey(inviteeUid, inviterUid);
  const stateWho = isCreator ? 'creatorState' : 'guestState';
  const stateKey =  `${invitationKey}/${stateWho}`;

  let data: any = {};

  // check if there is a proper state before updating?
  if(newState == 'left'){
    data = await RDB.read(invitationKey).catch(err => {});
    if(!data || !data.timestamp){ 
      return; 
    }
  }

  RDB.updateOne(stateKey, newState)
  .then(()=>{
      if(data && shouldDelete(data, { [stateWho] : newState })){
        deleteInvitation(inviteeUid, inviterUid);
      }
    })
    .catch(err => console.error(err));  
}

function shouldDelete(data: PrivateInvitationDataInterface|any, newData: any){
  const guestLeft = data?.guestState == 'left' || data?.guestState == 'reject' || newData?.guestState == 'reject' || newData?.guestState == 'left';
  const creatorLeft = data?.creatorState == 'left' || newData?.creatorState == 'left';
  return guestLeft && creatorLeft;
}

export function deleteInvitation(inviteeUid: string, inviterUid: string){
  const key = privateCallKey(inviteeUid, inviterUid);
  RDB.updateOne(key, null)
}