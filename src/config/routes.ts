import OutgoingCallPage from 'pages/OutgoingCallPage';
import IncomingCallPage from 'pages/IncomingCallPage';
import TeamCallPage from 'pages/TeamCallPage';
import Home from '../pages/HomePage';
import Login from '../pages/LoginPage';
import LoginSmall from '../pages/LoginPageSmall';
import Logout from '../pages/LogoutPage';
import ResetPage from '../pages/ResetPage';
import ResetPageSmall from '../pages/ResetPageSmall';
import Register from '../pages/RegisterPage';
import Profile from '../pages/ProfilePage';
import ProfileChangeEmail from '../pages/profile/ProfileChangeEmail';
import ProfileForgotPassword from '../pages/profile/ProfileForgotPassword';
import ProfileEditName from '../pages/profile/ProfileEditName';
import FinishRegistrationPage from 'pages/FinishRegistrationPage';

interface RouteType {
  path: string;
  component: any;
  name: string;
  protected: boolean;
  size?: string; // optional - large, medium, small, minimized
  nav?: boolean; // optional - if nav should be at the top
  isCallRoute?: boolean; // optional - only for routes that are used for calling
}

// these routes are not full, but need them for detection in resize
// check routes[] for exact route
const HOME_ROUTE = '/';
const LOGIN_ROUTE = '/login'
const LOGOUT_ROUTE = '/logout'
const REGISTER_ROUTE = '/register';
const FINISH_REGISTRATION_ROUTE = '/register-finish';
const RESET_ROUTE = '/reset';
const PROFILE_ROUTE = '/profile';
const PROFILE_CHANGE_EMAIL_ROUTE = '/profile/email'
const PROFILE_FORGOT_PASSWORD_ROUTE = '/profile/password'
const PROFILE_CHANGE_NAME_ROUTE = '/profile/name'

// small
const LOGIN_ROUTE_SMALL = '/login/small';
const RESET_ROUTE_SMALL = '/reset/small';

const OUTGOING_ROUTE = '/outgoing';
const INCOMING_ROUTE = '/incoming';
const TEAM_CALL_ROUTE = '/teamcall';

const ROUTES = { // TODO future imnprovement to use this ROUTES const everywhere
  // home: '/',
  // login: '/login',
  // loginSmall: '/login/small',
  // logout: '/logout',
  // register: '/register',
  // reset: '/reset',
  // resetSmall: '/reset/small',
  // profile: '/profile',
  // profileChangeEmail: '/profile/email',
  // profileForgotPassword: '/profile/password',
  // profileChangeName: '/profile/name',
  registerFinish: '/register-finish/:uid',
  outgoing: `/outgoing/:inviteeUid`,
  incoming: '/incoming/:room/:inviter',
  teamCall: '/teamcall/:room/:team/:company',

  getRegisterFinishRoute(uid: string){
    return ROUTES.registerFinish.replace(':uid', uid);
  },
  getOutgoingRoute(inviteeUid: string){
    return ROUTES.outgoing.replace(':inviteeUid', inviteeUid);
  },
  getIncomingRoute(roomId: string, inviterUid: string){
    return ROUTES.incoming.replace(':room', roomId).replace(':inviter', inviterUid);
  },
  getTeamCallRoute(roomId: string, teamUid: string, companyUid: string){
    return ROUTES.teamCall.replace(':room', roomId).replace(':team', teamUid).replace(':company', companyUid);
  }
}

const routes: RouteType[] = [
  {
    path: HOME_ROUTE,
    component: Home,
    name: 'Home',
    protected: true,
    nav: true,
  },
  {
    path: LOGIN_ROUTE,
    component: Login,
    name: 'Login',
    protected: false,
  },
  {
    path: LOGIN_ROUTE_SMALL,
    component: LoginSmall,
    name: 'Login_',
    protected: false,
  },
  {
    path: LOGOUT_ROUTE,
    component: Logout,
    name: 'Logout',
    protected: false,
  },
  {
    path: RESET_ROUTE,
    component: ResetPage,
    name: 'Reset',
    protected: false,
  },
  {
    path: RESET_ROUTE_SMALL,
    component: ResetPageSmall,
    name: 'Reset_',
    protected: false,
  },
  {
    path: REGISTER_ROUTE,
    component: Register,
    name: 'Register',
    protected: false,
  },
  {
    path: FINISH_REGISTRATION_ROUTE+'/:uid',
    component: FinishRegistrationPage,
    name: 'Registration finalization',
    protected: false,
  },
  {
    path: PROFILE_ROUTE,
    component: Profile,
    name: 'Profile',
    protected: true,
    nav: true,
  },
  {
    path: PROFILE_CHANGE_EMAIL_ROUTE,
    component: ProfileChangeEmail,
    name: 'Profile - Change Email',
    protected: true,
    nav: true,
  },
  {
    path: PROFILE_FORGOT_PASSWORD_ROUTE,
    component: ProfileForgotPassword,
    name: 'Profile - Change Password',
    protected: true,
    nav: true,
  },
  {
    path: PROFILE_CHANGE_NAME_ROUTE,
    component: ProfileEditName,
    name: 'Profile - Change Name',
    protected: true,
    nav: true,
  },
  {
    // path: OUTGOING_ROUTE+'/:inviteeUid',
    path: ROUTES.outgoing,
    component: OutgoingCallPage,
    name: 'Outgoing Call',
    protected: true,
    isCallRoute: true,
  },
  {
    // path: INCOMING_ROUTE+'/:room/:inviter',
    path: ROUTES.incoming,
    component: IncomingCallPage,
    name: 'Incoming Call',
    protected: true,
    isCallRoute: true,
  },
  {
    // path: TEAM_CALL_ROUTE+'/:room/:team',
    path: ROUTES.teamCall,
    component: TeamCallPage,
    name: 'Team Call',
    protected: true,
    isCallRoute: true,
  },
];

export default routes;

export {
  HOME_ROUTE, 
  LOGIN_ROUTE,
  LOGIN_ROUTE_SMALL,
  LOGOUT_ROUTE,
  RESET_ROUTE,
  RESET_ROUTE_SMALL,
  REGISTER_ROUTE,
  FINISH_REGISTRATION_ROUTE,
  PROFILE_ROUTE,
  PROFILE_CHANGE_EMAIL_ROUTE,
  PROFILE_FORGOT_PASSWORD_ROUTE,
  PROFILE_CHANGE_NAME_ROUTE,
  OUTGOING_ROUTE,
  INCOMING_ROUTE,
  TEAM_CALL_ROUTE,
  ROUTES,
}