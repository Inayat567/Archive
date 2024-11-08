
import * as RDB from 'firebase/firebaseCallEvents'
import { presenceKey } from 'common/realtimeCallKeys';
import { END_OF_TODAY } from 'config/constants';


interface PresenceValuesInterface{
  offline: string;
  online: string;
  busy: string;
}

export const PRESENCE_VALUES: PresenceValuesInterface = {
  offline: 'offline',
  online: 'online', // active
  busy: 'busy', // in a call or changed to do not disturb
}

export const PRESENCE_COLORS: PresenceValuesInterface = {
  offline: '#FF5250',
  online: '#80D06C',
  busy: '#F59506',
}

export const defaultPresenceState: PresenceStatusV2 = {
  presence: PRESENCE_VALUES.offline,
  status: '',
  expiry: 0,
}

export function emailValidation(email: string) {
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return String(email).match(validRegex);
}

/*
  min: 10 symbols
  extra: must contain both letters and numbers
*/
export function passwordValidation(password: string) {
  return String(password).trim().length >= 10 && /\d/.test(password) && /[a-zA-Z]/.test(password)
}

export const PASSWORD_VALIDATION_MESSAGE = 'Your password must contain at least 10 characters, including a combination of both letters and numbers.'

export function changeUserStatus(userUid: string, statusObj: PresenceStatusV2){
  
  /*
    presence_v2{
      presence: 'online/offline/busy', // busy for call or do not disturb mode
      status: '', // custom status unrelated to presence
      expiry: Date.now(),
    }
  */
  /*
      TODO
      1. update users table (is this needed?)
      2. update presence?
  */
  RDB.updateOne(presenceKey(userUid), statusObj);
}

export interface PresenceStatusV2{
  presence: string;
  status: string;
  expiry: number;
}

export function buildStatusObjectV2(presence: string, status: string|undefined=undefined, expiry: number|undefined=undefined): PresenceStatusV2{
  return {
    presence,
    status: (status!==undefined) ? status : '',
    expiry: (expiry!==undefined) ? expiry : 0,
  }
}

export function userStatusExpired(timestamp: number){
  const now = Date.now();
  return now > timestamp;
}


export function calcStatusExpiry(value: string|number){
  let timestamp = Date.now();
  if(value == END_OF_TODAY){ // find end of today
    const eod = endOfToday(); // TODO - check time and calc when today ends
    timestamp += eod;
  }else{ // expecting minutes value 
    const minutes = parseInt(value);
    timestamp += minutes * 60;
  }
  return timestamp;
}

function endOfToday(){
  const eod = new Date().setHours(23, 59, 59, 999);
  return eod.valueOf();
}