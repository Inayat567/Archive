export const ROLES = {
  user: 'user',
  guest: 'guest',
  host: 'host',
};

export const CONNECTION_STATE = {
  disconnected: 'Disconnected',
  connecting: 'Connecting',
  connected: 'Connected',
};

export const TEST_ROOM_ID = '6385fcbefef18a1d0aa764e3'; // later need to create room thru api
export const TEST_TEAM_CALL_ROOM = '638609bd9486d8dcd7d258d1';
export const TEST_TEAM_DATA = {
  uid: 'teamOne',
  name: 'teamOne'
}

export const CAN_REGISTER_WITHOUT_TEAM = false;
export const TEST_WITHOUT_CONNECTION = false;

export const TABLE_USERS = 'users_v2';
export const TABLE_INTERACTIONS = 'user_interactions';
export const TABLE_COMPANIES = 'companies'

export const USER_VERSION = 'v2' // for separation old and new v2 users (with companies)

export const END_OF_TODAY = 'EOD';

export interface CustomUserStatusInterface{
  key: string,
  title: string,
  selectable: boolean, // if status can be selected in profile status popup
}

export const MAX_CONTACTS_PER_COLUMN = 6; // default 6

export const STATUS_DO_NOT_DISTURB = 'donotdisturb';
export const STATUS_ON_A_CALL = 'oncall';

export const CUSTOM_USER_STATUSES: CustomUserStatusInterface[] = [
  {
    key: 'lunch',
    title: 'Out for lunch',
    selectable: true,
  },
  {
    key: 'sick',
    title: 'Out sick',
    selectable: true,
  },
  {
    key: 'vacation',
    title: 'On vacation',
    selectable: true,
  },
  {
    key: 'freshair',
    title: 'Getting some air',
    selectable: true,
  },
  {
    key: STATUS_DO_NOT_DISTURB,
    title: 'Do not disturb',
    selectable: false,
  },
  {
    key: STATUS_ON_A_CALL,
    title: 'On call',
    selectable: false,
  },
];

export type CallbackFunction = (...args: any[]) => any;
