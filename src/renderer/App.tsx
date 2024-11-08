import { selectIsConnectedToRoom, useHMSStore } from '@100mslive/react-sdk';
import UserPresence from 'common/UserPresence';
import { multiTeamListener } from 'common/callListeners';
import { CompanyContext, PresenceContext, UserContext } from 'common/context';
import { focusApp, onElectronResize } from 'common/electronResize';
import { windowMinimize } from 'common/electronResizeUtils';
import { checkUsedBefore, getLoginRoute, saveUsedBefore } from 'common/getRedirects';
import { useContactsStore } from 'common/useContactsStore';
import { useRequestsStore } from 'common/useRequestsStore';
import { PRESENCE_VALUES } from 'common/user';
import { usePresenceStore } from 'common/userPresenceStore';
import AdditionalCallRequest from 'components/common/AdditionalCallRequest';
import MinimizedView from 'components/common/MinimizedView';
import NavHeader from 'components/header/NavHeader';
import routes, { FINISH_REGISTRATION_ROUTE, HOME_ROUTE, LOGIN_ROUTE, LOGIN_ROUTE_SMALL, REGISTER_ROUTE, ROUTES } from 'config/routes';
import { auth } from 'firebase/firebaseApp';
import { getFullUser } from 'firebase/firebaseAuth';
import { getTeamInfo } from 'firebase/firebaseTeam';
import { getUserInfo, registerSocialUser, validateUserRegistration } from 'firebase/firebaseUser';
import useConstructor from 'hooks/useConstructor';
import { MEMBER_MEETING_STATES, TeamInvitationDataInterface } from 'interfaces/TeamInvitationDataInterface';
import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  matchRoutes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import 'styles/scss/main.scss';
import { privateCallListener } from '../common/callListeners';
import { companyStateListener } from '../common/companyStateListener';
import { IPrivateAdditionalRequest, ITeamAdditionalRquest } from '../interfaces/AdditionalRequestTypes';
import { FirestoreUserInterface, FullUserInterface } from '../interfaces/UserInterface';

let userInCall2 = false;
let currentAction = '' // using this instead of location.pathname, because location.pathname is buggy and shows home page when we're actually in registration page???

const loginRoutes = [
  LOGIN_ROUTE,
  LOGIN_ROUTE_SMALL
]
const authRoutes = [
  ...loginRoutes,
  REGISTER_ROUTE
]

export default function App() {

  const navigate = useNavigate();
  const [usedBefore, setUsedBefore] = useState<boolean>(checkUsedBefore());
  const [user, setUser] = useState<FullUserInterface|null>(null);
  const [userPresence, setUserPresence] = useState<UserPresence|null>(null);
  const [companyUpdated, setCompanyUpdated] = useState<number>(0);
  const location = useLocation()
  const [minimized, setMinimized] = useState(false);
  const [ready, setReady] = useState(false);
  const userPresenceStore = usePresenceStore();
  const presenceObj = usePresenceStore((state: any) => state.data);
  const clearStoredContacts = useContactsStore((s) => s.clearAll );
  const [userInCall, setUserInCall] = useState(false);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const { pendingRedirect, pendingRequest } = useRequestsStore((state) => state);
  const requestsStore: any = useRequestsStore();
  const [needFinish, setNeedFinish] = useState<boolean>(false) // require registration finalization
  const [currentAuth, setCurrentAuth] = useState(null)
  const [needCheck, setNeedCheck] = useState<boolean>(true)

  useConstructor(()=>{
    requestsStore.dispatch('reset'); // dont need requests pending after page refresh
    clearStoredContacts();
    window.electron.ipcRenderer.on('before-app-close', beforeAppClose)
  })

  useEffect(onComponentMount, []);
  useEffect(listenForInvitations, [user?.uid, user?.teams, ready]);
  useEffect(onRouteChange, [location])
  useEffect(onMinimizeChange, [minimized])
  useEffect(initialResize, [ready])
  useEffect(()=>{
      let stopListen = ()=>{}
      if(ready){
        if(user && user.uid && user.companies && user.companies.length){
          stopListen = companyStateListener(user.companies[0], ()=>{
            // update company state date stamp and trigger home contacts update
            setCompanyUpdated(Date.now())
          })
        }
      }
      return ()=>{
        if(stopListen) stopListen()
      }
  }, [user?.companies, ready])
  // useEffect(activeUserMouse, [])

  useEffect(()=>{

      if(pendingRedirect != null && isConnected){
          // should disconnect from within call page (and update status also)
      }else if(pendingRedirect != null && !isConnected){
        setTimeout(()=>{
          navigate(pendingRedirect);
          setTimeout(()=>{
            requestsStore.dispatch('reset');
          })
        }, 500)
      }
  }, [pendingRedirect, isConnected])

  useEffect(()=>{
    if(needFinish && currentAuth && location.pathname != FINISH_REGISTRATION_ROUTE){
      handleRegistrationFinalization(currentAuth)
    }else if (needCheck && !authRoutes.includes(currentAction) && currentAuth){
      checkUserState()
    }
  }, [needFinish, needCheck, location, currentAuth])


  function initialResize(){
    if(ready){
      onElectronResize(location.pathname, true); 
    }
  }

  // function activeUserMouse(){
  //   window.addEventListener('mousemove', onUserMouseMovement, false)
  //   return ()=>{
  //     window.removeEventListener('mousemove', onUserMouseMovement, false)
  //   }

  //   function onUserMouseMovement(){
  //     if(ready && notOfflineOrBusy(presenceObj.status)){
  //       userPresenceStore.dispatch({
  //         status: PRESENCE_VALUES.online
  //       })
  //     }
  //   }
  // }

  async function onFinishRegistration(userUid: string){
      const fullUser = await getFullUser({ uid: userUid }).catch(err => console.error(err));
      if(fullUser){
        setNeedFinish(false)
        setReady(true);
        setUser(fullUser);
        initializeUserPresence(fullUser, ()=>{
          setTimeout(()=>{
            navigate(HOME_ROUTE)
          }, 50);
        });
      }
  }

  // triggers on load incorrectly
  function onMinimizeChange(){
    if(!ready) return;
    const className = 'is-minimized';
    if(minimized){
      windowMinimize(280, 55, true); // might need adjustments on different platforms
      document.body.classList.add(className);
    }else{
      const splt = location.pathname.split('/');
      onElectronResize(`/${splt[1]}`, true, {
        maximizing: true
      }); // dont need params, just how route starts
      document.body.classList.remove(className);
    }
  }

  function toggleMinimize(){
    setMinimized(!minimized);
  }

  async function handleRegistrationFinalization(authUser: any){
    setReady(true);
    console.log('reg social user', authUser)
    await registerSocialUser(authUser);
    const routeTo = ROUTES.getRegisterFinishRoute(authUser.uid);
    navigate(routeTo);
  }

  function onComponentMount(){

    let unsub = auth.onAuthStateChanged(async (authUser: any) => {
      if (authUser) {

        setCurrentAuth(authUser)

      } else { // redirect to login if invalid auth

        setReady(true);
        setCurrentAuth(null)
        const currentRoute = matchRoutes(routes, location)
        if(currentRoute && currentRoute[0]?.route.protected === true && !loginRoutes.includes(location.pathname)){
          navigate(getLoginRoute());
        }

      }
    });
    window.addEventListener('beforeunload', beforeAppClose);
    
    return ()=>{
      if(unsub) unsub();
      if(userPresence?.destroy) userPresence.destroy();
      window.removeEventListener('beforeunload', beforeAppClose);
    }
  }

  async function checkUserState(){

      if(authRoutes.includes(location.pathname) || authRoutes.includes(currentAction))
        return
      
      if(!currentAuth || !needCheck)
        return

      const valid = await validateUserRegistration(currentAuth);
      setNeedCheck(false)
      if(!valid){
        handleRegistrationFinalization(currentAuth);
      }else{
        setFullUser(currentAuth);
        if(location.pathname !== HOME_ROUTE) navigate(HOME_ROUTE);
      }
  }
  

  function beforeAppClose(){
    userPresence?.changePresence(PRESENCE_VALUES.offline);
  }
  
  async function setFullUser(authUser: FirestoreUserInterface){     
    const fullUser = await getFullUser(authUser);
    setUser(fullUser);
    setReady(true);
    initializeUserPresence(fullUser);
  }

  function initializeUserPresence(fullUser: any, callback: any = null){
    if(userPresence !== null){
      userPresence?.destroy();
    }
    const newUserPresence = new UserPresence(fullUser, userPresenceStore.dispatch);
    setUserPresence(newUserPresence);
    saveUsedBefore();
    if(callback) callback();
  }

  function listenForInvitations(){
    if(user && user.uid && ready){

      const privateListener = privateCallListener(user, incomingCallCallback);
      let teamListener: any = null
      multiTeamListener(user, incomingTeamCall)
        .then((_teamListener)=>{
          teamListener = _teamListener
        })

      return ()=>{ // on unmount - remove listeners
        if(privateListener) privateListener();
        if(teamListener){
          teamListener.forEach((stopTeamListener: any)=> stopTeamListener());
        }
      }
    }
  }

  function incomingCallCallback(data: any) { // PrivateInvitationDataInterface

    if(data && !!data?.room){

      if(userInCall || userInCall2){
        // private 
        if(minimized) setMinimized(false);
        focusApp();
        additionalIncomingRequest({
          room: data.room,
          person: data.createdBy,
          company: data.company
        }, true)

      }else{
        if(minimized) setMinimized(false);
        setTimeout(()=>{
          focusApp();
          const incomingRoute = ROUTES.getIncomingRoute(data.room, data.createdBy);
          navigate(incomingRoute); // TODO - add caller uid or name to display in incoming page?
        }, 100)
      }
    }else{
      console.error('failed room navigation?', data);
    }
  }

  function incomingTeamCall(data: TeamInvitationDataInterface){
    if(data && !!data?.room && !!data?.team){
      if(data?.createdBy == user?.uid){
        // skip, because you created it
        return;
      }
      
      // first, check if state is live
      // second, check if user was invited (in case we add additional functionality to not invite everyone)
      if(data.state == 'live') {
        let invited = false;
        Object.keys(data.members).forEach((uid)=>{
          if(uid == user?.uid && data.members[uid].state == MEMBER_MEETING_STATES.invited){
            invited = true;
          }
        });
        if (invited) {
          if(minimized) setMinimized(false);
          focusApp();

          if(userInCall){

            additionalIncomingRequest({
              room: data.room, 
              team: {
                uid: data.team,
                name: '',
                users: []
              },
              company: data.company
            }, false)

          }else{
                     
            let teamCallRoute = ROUTES.getTeamCallRoute(data.room, data.team, data.company);
            navigate(teamCallRoute);
          }
        }
      }
    } else{
      console.error('Missing room or team', data);
    }
  }

  function onRouteChange(){
    currentAction = location.pathname
    if(!ready) return;

    setUsedBefore(checkUsedBefore()); // in case it gets cleared on dev
    onElectronResize(location.pathname);

    // is user in a call state
    const currentRoute = matchRoutes(routes, location)
    const inCall = !!(currentRoute && currentRoute[0]?.route.isCallRoute === true);
    setUserInCall(inCall);
    userInCall2 = inCall;
  }

  async function additionalIncomingRequest(options: any, isPrivate: boolean){

    if(pendingRequest !== null && pendingRequest.room == options.room){
      return;
    }

      if(isPrivate){
        let person = await getUserInfo(String(options.person));
        
        if(person){

          const reqData: IPrivateAdditionalRequest = {
            person: person,
            room: options.room,
            company: options.company,
          }

          requestsStore.dispatch('pendingRequest', reqData)
        }
      }else{
       
        let team = await getTeamInfo(options.company, String(options.team));
        if(team){

          const reqData: ITeamAdditionalRquest = {
            team,
            room: options.room,
            company: options.company,
          }
          requestsStore.dispatch('pendingRequest', reqData)
        }
      }
  }

  const availableRoutes = !!user ? routes : routes.filter(r => r.protected === false);

  return (
    <div id="app">
      <UserContext.Provider value={{ user, userInCall, setUser, usedBefore, onFinishRegistration }}>
        <CompanyContext.Provider value={{ companyUpdated }}>
        <PresenceContext.Provider value={userPresence}>
          <Routes>
            {availableRoutes.map((route: any, index: any) => (
                <Route
                  index={route.path == HOME_ROUTE}
                  key={route.path}
                  path={route.path}
                  element={(
                  <>
                    { 
                      minimized
                      ?
                        <MinimizedView toggleMinimize={toggleMinimize} />
                      :
                        route?.nav === true
                        ?
                          <NavHeader toggleMinimize={toggleMinimize} />
                        :
                        null
                    }
                    <route.component toggleMinimize={toggleMinimize} />
                  </>
                  )}
                />
            ))}
          </Routes>
          {
            pendingRequest !== null
            ?
            <AdditionalCallRequest  />
            :
            null
          }
        </PresenceContext.Provider>
        </CompanyContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
