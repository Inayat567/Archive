export enum PRIVATE_MEETING_STATE {
    invite = 'invite',
    accept = 'accept',
    reject = 'reject',
    left = 'left',
    joined = 'joined',
}

export type InvitationStateType = 
    PRIVATE_MEETING_STATE.invite |
    PRIVATE_MEETING_STATE.accept |
    PRIVATE_MEETING_STATE.reject |
    PRIVATE_MEETING_STATE.left |
    PRIVATE_MEETING_STATE.joined;


export interface PrivateInvitationDataInterface{
    name: string
    room: string
    timestamp: number
    createdBy: string
    guestState: InvitationStateType
    creatorState: InvitationStateType
    company: string
    // TODO - add nextCallAvailableIn? to prevent from spam calls
    // TODO - add notifications if invited user sees or hears invitee?
}
