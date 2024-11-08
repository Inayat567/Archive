
import { teamCallMemberStateKey } from "common/realtimeCallKeys";
import { MemberState } from "interfaces/TeamInvitationDataInterface";
import * as RDB from "firebase/firebaseCallEvents";

export function updateTeamMemberCallState(state: MemberState, teamUid: string, userUid: string){
    const memberStateKey = teamCallMemberStateKey(teamUid, userUid);
    return RDB.updateOne(memberStateKey, state);
}