
import { UserContext } from 'common/context';
import { useContactsStore } from 'common/useContactsStore';
import Logo from 'components/icons/Logo';
import { ROUTES } from "config/routes";
import { getUsersInCompany } from 'firebase/firebaseContact';
import { useMissedCalls } from 'hooks/useMissedCalls';
import { getLastInteractions } from 'interfaces/LastInteractionHandler';
import { UserInfoInterface } from 'interfaces/UserInterface';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronUp from 'styles/images/calls/chevron-up.svg';

import FavContactUser from '../contacts/FavContactUser';
interface Props{
    children?: any
    toggleMinimize: any,
}
let contactsTimeout: ReturnType<typeof setTimeout>;


export default function MinimizedView(props: Props){

    const { user } = useContext<any>(UserContext);
    const { missedCounter, stopMissedCallsListener } = useMissedCalls(user.uid);
    const [favContact, setFavContact] = useState<UserInfoInterface[]>([]);
    const storedContacts = useContactsStore((s: any) => s.users);

    const navigate = useNavigate();

    useEffect(()=>{
        return ()=>{
            if(stopMissedCallsListener) stopMissedCallsListener();
        }
    }, [])
    useEffect(() => {
        if (user) {
          init();
        }
      }, [user]);
      async function init() {
        if (user.companies && user.companies.length > 0) {
         
    
          contactsTimeout = setTimeout(() => {
            // just in case realtime listener triggers it again...
            getUserContacts();
          }, 1000);
        }
      }
      function getUserContacts(forceUpdate: boolean = false) {
        _getUserContacts(forceUpdate).then(async (contacts: UserInfoInterface[]) => {
          const userDialingInfo = await getLastInteractions(user.uid);
              let favContactsDetails:any=[]
          userDialingInfo.numbersOfCalls.map((key: any) => {
           let contact = contacts.find((contact: UserInfoInterface) => contact.uid === key);
           if (contact) {
             favContactsDetails.push(contact);
            }
          });            
          setFavContact(favContactsDetails);
    
        });
      }
      function _getUserContacts(forceUpdate: boolean = false) {
        if (storedContacts && storedContacts.length && !forceUpdate) {
          return Promise.resolve(storedContacts);
        } else {
          const except = [user.uid];
          return getUsersInCompany(user.companies[0], except); // only one company supported right now, but its array based and can be easily changed. Multi company might need some grouping by company for clarity
        }
      }
      const createCall = (contact: any) => {
        createPrivateCall(contact.uid)
      };
      function createPrivateCall(uid: string){
        props.toggleMinimize();
        navigate(ROUTES.getOutgoingRoute(uid));
    }

    return(
        <div className="minimzed-view">
            <div className="minimzed-view__left">
                {
                    props?.children 
                    ? 
                        props.children
                    :
                        <img className="photon-logo__small" src={Logo} />
                }
                {favContact.length > 0  &&
      <>
      {favContact.map((contact: any) => {
       return <FavContactUser user={contact} createCall={createCall} key={contact.uid} />
      })}

      </>
      }
            </div>
            
            <div className="minimzed-view__right">
                
                <button className="clear-light" onClick={props.toggleMinimize}>
                    <img src={ChevronUp} />
                </button>
                {
                    missedCounter > 0
                    &&
                    <div className='missed-icon'>{missedCounter}</div>
                }
            </div>
        </div>
    )
}