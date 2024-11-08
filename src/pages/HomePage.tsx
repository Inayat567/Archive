import { useContext, useEffect, useState } from 'react';
import { getUsersInCompany } from 'firebase/firebaseContact';
import { useLocation } from 'react-router-dom';
import { UserContext } from 'common/context';
import { MAX_CONTACTS_PER_COLUMN } from 'config/constants';
import ComboViewList from 'components/contacts/ComboViewList';
import { getCombinedContacts, getFilteredContacts, getOrderedContacts } from 'common/combinedContacts';
import { HOME_ROUTE } from 'config/routes';
import { getLastInteractions } from 'interfaces/LastInteractionHandler';
import { useContactsStore } from 'common/useContactsStore';
import { getTeamsUserBelongsTo } from 'firebase/firebaseCompany';
import { getTeamInfo } from 'firebase/firebaseTeam';
import { CompanyContext } from '../common/context'

let contactsTimeout: ReturnType<typeof setTimeout>;

function HomePage() {

  const { user } = useContext<any>(UserContext);
  const { companyUpdated } = useContext(CompanyContext)
  const [contacts, setContacts] = useState<any[]>([]);
  const [teams, setTeams] = useState([]);
  const [combinedContacts, setCombinedContacts] = useState<any[]>([]);
  const [multiColumnUsers, setMultiColumnUsers] = useState(false);
  // const [multiColumnTeams, setMultiColumnTeams] = useState(false); // might need one day
  const [lastInteractions, setLastInteractions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false); // combo view -> both contacts and teams in one list
  const [ready, setReady] = useState(false)
  const location = useLocation();
  const storeContacts = useContactsStore((s:any)=>s.setUsers);
  const storedContacts = useContactsStore((s: any)=>s.users);
  const storeTeams = useContactsStore((s:any)=>s.setTeams);
  const storedTeams = useContactsStore((s: any)=>s.teams);

  useEffect(()=>{ // if clicking on logo from home page it should go back to small view
    if(location?.pathname == HOME_ROUTE){
      setIsExpanded(false);
      setMultiColumnUsers(false);
    }
  }, [location])

  useEffect(() => {
    if (user) {
      init();
    }
  }, [user]);

  useEffect(()=>{
    if(companyUpdated > 0 && ready){
      clearTimeout(contactsTimeout)
      contactsTimeout = setTimeout(()=>{
        getUserContacts(true)
      }, 1000)
    }
  }, [companyUpdated])


  useEffect(()=>{
    if(user && user.uid){
      if(isExpanded){
        setMultiColumnUsers(contacts.length > MAX_CONTACTS_PER_COLUMN);
      }else{
          const combined = getCombinedContacts(contacts, teams, user?.uid, MAX_CONTACTS_PER_COLUMN);
          setCombinedContacts(combined);
      }
    }
  }, [contacts.length, teams.length, isExpanded])

  async function init(){

    if(user.companies && user.companies.length > 0){

      const interactions = await getLastInteractions(user.uid).catch(err => {/* no interactions so far*/});
      if(interactions){
        setLastInteractions(interactions); // just in case we need it for something else
      }
      
      contactsTimeout = setTimeout(()=>{ // just in case realtime listener triggers it again...
        getUserContacts()
      }, 1000)

      setReady(true)

      _getTeams()
      .then((t: any)=>{
        storeTeams(t);
        setTeams(t);
      })
    }
  }

  function getUserContacts(forceUpdate: boolean = false){
    _getUserContacts(forceUpdate)
      .then((contacts: any) => {
        storeContacts(contacts);
        const filtered = getFilteredContacts(contacts, user.uid);
        const ordered = getOrderedContacts(filtered, lastInteractions);
        setContacts(ordered);
      });
  }

  function _getUserContacts(forceUpdate: boolean = false){
    if(storedContacts && storedContacts.length && !forceUpdate){  
      return Promise.resolve(storedContacts);
    }else{
      const except = [user.uid]
      return getUsersInCompany(user.companies[0], except); // only one company supported right now, but its array based and can be easily changed. Multi company might need some grouping by company for clarity
    }
  }

  function _getTeams(){
    if(storedTeams && storedTeams.length){  
      return Promise.resolve(storedTeams);
    }else{
      return getTeamsUserBelongsTo(user.uid, user.companies); 
    }
  }

  function expandedView(){
    const { onElectronResize } = require('common/electronResize'); // cant be called on initialization of home page
    if(onElectronResize){
      onElectronResize('/home-contacts-expanded', true);
    }
    setIsExpanded(true)
  }


  const homePageClasses = ['page-limiter'];
  if(isExpanded && multiColumnUsers){
    homePageClasses.push('half-expanded');
  }else if(isExpanded || multiColumnUsers){
    homePageClasses.push('medium');
  }

  return (
    <div className="home-page hide-on-minimize">
      <div className={homePageClasses.join(' ')}>
        <div className={"contact-list-wrapper " + (isExpanded ? 'expanded' : '') }>
        { 
          isExpanded ?
            <div className="side-by-side">
              <ComboViewList expanded={isExpanded} contacts={teams} title={'Teams'} multiColumn={multiColumnUsers} />
              <ComboViewList expanded={isExpanded} contacts={contacts} title={'All contacts'} multiColumn={multiColumnUsers} />
            </div>
          :
          <>
            <ComboViewList contacts={combinedContacts} title={'All contacts'}>
              <button onClick={expandedView} className="dark">See all</button>
            </ComboViewList>
          </>
        }
        </div>
      </div>
    </div>
  );
}

export default HomePage;
