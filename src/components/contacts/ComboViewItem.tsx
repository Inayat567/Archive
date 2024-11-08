import { isTeamContact } from "common/utils";
import TeamContact from "components/teams/TeamContact";
import ContactUser from "./ContactUser";

interface Props{
    contact: any,
    createCall: any,
    joinCall: any,
}

export default function ComboViewItem(props: Props){

    const { contact, createCall, joinCall = undefined } = props;

    if(isTeamContact(contact)){
        return (
            <TeamContact
                team={contact}
                createCall={createCall}
                joinCall={joinCall}
                key={contact.uid}
            />
        )
    }
    return (
        <ContactUser
              user={contact}
              createCall={createCall}
              key={contact.uid}
            />
    )
}