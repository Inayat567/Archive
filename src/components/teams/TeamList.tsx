import { teamCallKey } from "common/realtimeCallKeys";
import { userName } from "common/utils";
import useFilteredContacts from "hooks/useFilteredContacts";
import ContactsFilter from "components/contacts/ContactsFilter";
import { TEST_TEAM_CALL_ROOM } from "config/constants";
import { getDatabase } from "firebase/database";
import { db } from "firebase/firebaseApp";
import { updateOne } from "firebase/firebaseCallEvents";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { TeamCallMember, TeamCallMembers, TeamInvitationDataInterface, TEAM_MEETING_STATES } from "interfaces/TeamInvitationDataInterface";
import { UserInterface, UserInterfaceObject } from "interfaces/UserInterface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Team from "./TeamContact";

function TeamList(props: any) {
  const { teams, user } = props;
  const navigate = useNavigate();
  const [room, setRoom] = useState<string|null>(null)

  const [inputFilter, setInputFilter] = useState('');
  const filteredTeams = useFilteredContacts(teams, inputFilter);

  /*
    1. check if room exists for team call
    2. if not - create a new room and save it in database
    3. reditect to team call page with known room

    TODO - check if team room does not exist
  */
  async function teamCall(teamUid: string){
    const room = await getRoom(teamUid);
    inviteTeamMembers(teamUid, String(room));
    navigate(`/teamcall/${room}/${teamUid}`, { state: { host: true } });
  }

  async function getRoom(team: string){
    const existingRoom = await checkIfExists(team);
    if(existingRoom){
      return existingRoom;
    }
    return await createRoom();
  }

  // checks in database if team has an active room
  function checkIfExists(team: string){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve(TEST_TEAM_CALL_ROOM);
      }, 500);
    })
  }

  // creates room via 100ms and stores information in database
  function createRoom(): Promise<string>{
    // TODO
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve(TEST_TEAM_CALL_ROOM);
      }, 500);
    }) 
  }

  async function inviteTeamMembers(team: string, room: string){
    // TODO
    // 1. get all team members and their states
    // 2. invite all members by setting their member[] in team_call realtime database

    const teamkey = teamCallKey(team);
    const members: any = await getTeamMembers(team).catch(onTeamMembersError);
    const data: TeamInvitationDataInterface = {
      createdBy: user.uid,
      room,
      team,
      state: TEAM_MEETING_STATES.live,
      members,
    }
    // update realtime db
    updateOne(teamkey, data)
    .then(()=>{
      // console.log('members invited', data.members)
    })
    .catch(err => {
      console.error(err);
    })

  }

  function onTeamMembersError(err: any){
    console.error(err);
    throw new Error('Team members not found!')
  }

  // v1 - gets all users
  // TODO - v2 - get only users in a team
  async function getTeamMembers(team: string): Promise<TeamCallMembers>{
      // TODO - get members of 'team'
      const data = await getDocs(collection(db, 'users'));
      const members: TeamCallMembers = {};
      data.forEach((doc)=>{
        if(doc && doc.id){
          let member = doc.data();
          members[doc.id] = {
            uid: doc.id,
            name: userName(member),
            state: doc.id == user.uid ? 'accepted' : 'invited'
          };
        }
      });
      return members;
  }


  return (
    <section className="teamList">
      <div>
        <h2>Teams:</h2>
        <ContactsFilter onChange={setInputFilter} filterKeys={['name']} />
      </div>
      {filteredTeams.map((team: any) => {
          return (
            <Team
              team={team}
              handleClick={() => teamCall(team.uid)}
              key={team.uid}
            />
          );
      })}
    </section>
  );
}

export default TeamList;
