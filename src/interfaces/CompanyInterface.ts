
export interface CompanyTeamInterface{
    name: string
    users: string[]
}

export interface CompanyTeamGetterInterface extends CompanyTeamInterface{
    uid: string // added manually
}

export interface CompanyInterface{
    uid?: string // added manually on frontend
    name: string
    invitationCode: string
    teams: CompanyTeamInterface
}