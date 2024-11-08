import { UserInfoInterface } from './UserInterface';
import { TeamInfoInterface } from '../firebase/firebaseTeam';


interface IAdditionalRequestInfo{
    room: string
    company: string // company uid
}

export interface IPrivateAdditionalRequest extends IAdditionalRequestInfo{
    person: UserInfoInterface
}

export interface ITeamAdditionalRquest extends IAdditionalRequestInfo{
    team: TeamInfoInterface
}
