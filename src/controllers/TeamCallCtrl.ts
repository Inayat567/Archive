import { TABLE_USERS } from "config/constants";
import { teamCallKey } from "common/realtimeCallKeys";
import { userName } from "common/utils";
import { db } from "firebase/firebaseApp";
import { updateOne } from "firebase/firebaseCallEvents";
import { collection, getDocs, where } from "firebase/firestore";
import { MEMBER_MEETING_STATES, TeamCallMembers, TeamInvitationDataInterface, TEAM_MEETING_STATES } from "interfaces/TeamInvitationDataInterface";
import { createRoom } from "common/apiRequests";
import { query } from "firebase/database";
import { getUsersInTeam } from 'firebase/firebaseContact';
import { UserInfoInterface } from '../interfaces/UserInterface';

interface Props{
    companyUid: string
    user: UserInfoInterface
    teamUid: string
}

export default class TeamCallCtrl{
    companyUid: string;
    teamUid: string;
    room: string;
    user: any;
    isHost: boolean;

    // constructor(uid: string, user: any){
    constructor(options: Props){
        this.companyUid = options.companyUid;
        this.teamUid = options.teamUid;
        this.user = options.user;
        this.room = '';
        this.isHost = false;
    }

    async init(){

        this.room = await this.getRoom(this.teamUid).catch(this.errorOnCreateRoom)
        const success = await this.inviteTeamMembers(this.room).catch(err => {});
        if(success){
            return this.room;
        }
        return null;
    }


    async getRoom(teamUid: string): Promise<string>{
        return new Promise(async (resolve, reject)=>{
            const existingRoom = await this.checkRoomExists(teamUid).catch(roomDoesntExist => {})
            if(existingRoom){
                resolve(existingRoom);
            }
            const roomConfig = this.roomConfig(teamUid);
            createRoom(roomConfig)
            .then((roomId: string) => resolve(roomId))
            .catch((error: any) => {
                reject(error);
            });
        })
    }

    async checkRoomExists(teamUid: string): Promise<string>{
        // check if teamUid has existing room
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                // resolve(TEST_TEAM_CALL_ROOM);
                reject(false);
            }, 500);
        })
    }

    roomConfig(teamUid: string){
        // TODO - add yyyy or month or day or combination of those. Coz rooms can be disabled and it threw "server error room is not active"
        return {
            room: `team_${teamUid}`
        }
    }

    async getTeamMembers(): Promise<TeamCallMembers>{

        let members: TeamCallMembers = {}
        const teamUsers = await getUsersInTeam(this.companyUid, this.teamUid)
        teamUsers.forEach((u: UserInfoInterface)=>{
            members[u.uid] = {
                uid: u.uid,
                name: userName(u),
                state: u.uid == this.user.uid ? MEMBER_MEETING_STATES.accepted : MEMBER_MEETING_STATES.invited
            }
        })
        return members;
    }

    async inviteTeamMembers(room: string){
        const teamkey = teamCallKey(this.teamUid);
        const members: any = await this.getTeamMembers().catch(this.onTeamMembersError);
        const data: TeamInvitationDataInterface = {
            createdBy: this.user.uid,
            room,
            team: this.teamUid,
            company: this.companyUid,
            state: TEAM_MEETING_STATES.live,
            members,
        }

        return new Promise((resolve, reject)=>{
            // update realtime db
            updateOne(teamkey, data)
            .then(()=>{
                resolve(true);
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
        })
    }

    onTeamMembersError(err: any){
        console.error(err);
        throw new Error('Team members not found!')
    }

    errorOnCreateRoom(error: any){
        console.log('error while creating room', error);
        throw new Error('Failed creating a room');
    }
}