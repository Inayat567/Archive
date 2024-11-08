import { isTeamContact } from "common/utils";
import useFilteredContacts from "hooks/useFilteredContacts";
import ContactsFilter from "components/contacts/ContactsFilter";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeamCallCtrl from "controllers/TeamCallCtrl";
import { UserContext } from "common/context";
import ColumnMulti from "./ColumnMulti";
import ColumnSingle from "./ColumnSingle";
import { listenOnceAsync } from "firebase/firebaseCallEvents";
import { teamCallKey } from "common/realtimeCallKeys";
import { ROUTES } from "config/routes";

interface Props{
    contacts: any,
    title: string,
    children?: any,
    expanded?: boolean,
    multiColumn?: boolean,
}

export default function ComboViewList(props: Props){

    const { contacts, title, expanded = false, multiColumn = false } = props;
    const { user } = useContext<any>(UserContext);
    const [inputFilter, setInputFilter] = useState('');
    const filteredContacts = useFilteredContacts(contacts, inputFilter)
    const navigate = useNavigate();

    async function createCall(contact: any, callback: any){
        if(isTeamContact(contact)){
            await createTeamCall(contact.uid);
        }else{
            createPrivateCall(contact.uid);
        }         
        if(callback) callback();
    }

    async function createTeamCall(teamUid: string){

        const companyUid = user.companies[0]
        const teamCallCtrl = new TeamCallCtrl({
            companyUid, // if supporting multi company, might need to check which company teamUid belongs to
            teamUid, 
            user,
        });
        const room = await teamCallCtrl.init();
        if(room){
            console.log('should navigate to team room', room, teamUid);
            const teamCallRoute = ROUTES.getTeamCallRoute(room, teamUid, companyUid);
            navigate(teamCallRoute, { state: { host: true } });
            return true;
        }else{
            console.error('Team call failed - room not found', room);
            return false;
        }
    }
    
    async function joinTeamCall(teamUid: string, rejoin: boolean = false){

        const refKey = teamCallKey(teamUid);
        const data:any = await listenOnceAsync(refKey).catch(err => { console.error(err)})

        if(data && data?.state == 'live'){
            const urlsParams = new URLSearchParams({ rejoin: rejoin ? '1' : '0'});
            const teamCallRoute = ROUTES.getTeamCallRoute(data.room, data.team, data.company);
            navigate(teamCallRoute+'?'+urlsParams)
            return true;
        }
        return false;
    }

    function joinCall(contact: any, rejoin: boolean = false){
        joinTeamCall(contact.uid, rejoin);
    }

    function createPrivateCall(uid: string){
        navigate(ROUTES.getOutgoingRoute(uid));
    }

    const SingleOrMultiColumn = multiColumn ? ColumnMulti : ColumnSingle;

    return (
        <section className="contact-list">
            <div className="contact-list__header">
                {
                    expanded
                    ?
                        <>
                            <h2 className="title">{ title }</h2>
                            <ContactsFilter onChange={setInputFilter} />
                        </>
                    :
                        <>
                            <ContactsFilter onChange={setInputFilter} defaultExpanded={true} />
                            { props?.children && props.children}
                        </>
                }
               
            </div>
            <div className="contact-list__items">
                <SingleOrMultiColumn 
                    contacts={filteredContacts} 
                    createCall={createCall} 
                    joinCall={joinCall}
                    />
                {
                    filteredContacts.length === 0 && <div className="contacts-not-found">Not found</div>
                }
            </div>
        </section>
    )
}