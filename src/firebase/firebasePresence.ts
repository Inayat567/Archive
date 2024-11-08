import { teamMemberPresenceKey } from 'common/realtimeCallKeys';
import { getDatabase, ref, set, onDisconnect, onValue } from 'firebase/database';

const db = getDatabase();

export function detectConnectionState(callback: any){
  const db = getDatabase();
  const connectedRef = ref(db, ".info/connected");
  return onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

export function getTeamRef(userUid: string, teamUid: string){
  return ref(db, teamMemberPresenceKey(teamUid, userUid));
}

export function updateUserTeamPresence(userUid: string, teamUid: string, presence: string){
  const ref = getTeamRef(userUid, teamUid);
  set(ref, presence);
}

