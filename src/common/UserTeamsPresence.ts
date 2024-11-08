
import { updateOne } from "firebase/firebaseCallEvents";
import { teamMemberPresenceKey } from "./realtimeCallKeys";
import { PresenceStatusV2, PRESENCE_VALUES } from "./user";
import { isOnline, onlineOrBusy } from "./utils/presenceUtils";

// update user presence in teams realtime database
export default class UserTeamsPresence{

    user: any = null;
    teams: string[] = [];

    /*
        TODO - on disconnect set team refs for this user
    */

    constructor(user: any, teams: string[]){

        this.user = user;
        this.teams = teams;
    }

    update(presenceObj: PresenceStatusV2){
        let presence = isOnline(presenceObj) ? onlineOrBusy(presenceObj) : PRESENCE_VALUES.offline;
        this.teams.forEach(teamUid => {
            this._updateRDB(teamUid, this.user.uid, presence);
        })
        
    }

    _updateRDB(teamUid: string, userUid: string, presence: string){

        const ref = teamMemberPresenceKey(teamUid, userUid);
        updateOne(ref, presence).catch(this.handleError)
    }

    handleError(error: any){
        console.error('Team presence failed to update', error);
    }

}