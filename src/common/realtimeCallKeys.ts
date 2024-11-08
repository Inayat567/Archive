
const PRESENCE_KEY = 'presence_v2';
const TEAM_PRESENCE_KEY = 'team_presence_v2';
const TEAM_CALL_KEY = 'team_call_v2';
const PRIVATE_CALL_KEY = 'private_call_v2';
const COMPANY_KEY = 'company_users_state'

export function privateCallKey(userUid: string, inviterUId: string){
    return `${PRIVATE_CALL_KEY}/${userUid}/${inviterUId}`;
}

export function allPrivateCallsKey(userUid: string){
    return `${PRIVATE_CALL_KEY}/${userUid}`;
}

export function teamCallKey(teamUid: string){
    return `${TEAM_CALL_KEY}/${teamUid}`; // for updating whole data
}

export function teamCallStateKey(teamUid: string){
    return `${TEAM_CALL_KEY}/${teamUid}/state`; 
}

export function teamCallMemberKey(teamUid: string, userUid: undefined|string){
    return `${TEAM_CALL_KEY}/${teamUid}/members/${userUid}`
}

export function teamCallMemberStateKey(teamUid: string, userUid: undefined|string){
    return `${TEAM_CALL_KEY}/${teamUid}/members/${userUid}/state`
}

export function presenceKey(userUid: string, partial: string|undefined = undefined){
    let key = `${PRESENCE_KEY}/${userUid}`;
    if(!!partial) key += ''+partial;
    return key;
}

export function teamPresenceKey(teamUid: string){
    return `${TEAM_PRESENCE_KEY}/${teamUid}`;
}

export function teamMemberPresenceKey(teamUid: string, userUid: string, partial: string|undefined = undefined){
    let key = `${TEAM_PRESENCE_KEY}/${teamUid}/${userUid}`;
    if(!!partial){
        key += ''+partial;
    }
    return key;
}

export function companyUsersStateKey(companyUid: string){
    return `${COMPANY_KEY}/${companyUid}`
}
