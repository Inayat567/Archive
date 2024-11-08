

export enum MEMBER_MEETING_STATES {
    invited = 'invited',
    accepted = 'accepted',
    rejected = 'rejected',
    left = 'left',
    rejoined = 'rejoined',
}

export type MemberState = 
    MEMBER_MEETING_STATES.invited | 
    MEMBER_MEETING_STATES.accepted | 
    MEMBER_MEETING_STATES.rejected | 
    MEMBER_MEETING_STATES.left |
    MEMBER_MEETING_STATES.rejoined;

export enum TEAM_MEETING_STATES {
    live = 'live',
    ended = 'ended',
}

export type TeamCallState = 
    TEAM_MEETING_STATES.live | 
    TEAM_MEETING_STATES.ended;

export type TeamCallMember = {
    uid: string,
    name: string,
    state: MemberState,
}

export interface TeamCallMembers{
    [uid: string]: TeamCallMember,
}

export interface TeamInvitationDataInterface{
    createdBy: string // user.uid
    room: string // room id
    state: TeamCallState
    team: string // team uid (firebase)
    members: TeamCallMembers
    company: string // company uid
}
