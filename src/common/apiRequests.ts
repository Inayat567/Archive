// TODO
// import { getApp } from "firebase/app";
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "localhost", 5001);

import { apiRootUrl } from "firebase/firebase.config";

interface CreateRoomParams {
  room: string;
}

interface RoomCreationResponse {
  id: string; // room id
  [key: string]: any;
}

interface ApiError {
  message: string;
  error?: any;
}

interface GetTokenParams {
  role: string;
  user_id: string;
  room_id: string;
}

interface GetTokenResponse {
  token: string;
}

const POST_REQUEST = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // body: JSON.stringify(data),
  // mode: 'cors', // no-cors, *cors, same-origin
  // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  // credentials: 'same-origin', // include, *same-origin, omit
};

// TODO - use connectFunctionsEmulator instead
function getApiUrl(val: string) {
  return `${getApiRoot()}${val}`;
}

function getApiRoot() {
  return apiRootUrl
}

function getRoomToken(params: GetTokenParams): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(getApiUrl('/token'), getTokenOptions(params))
      .then(res => res.json())
      .then((data: GetTokenResponse) => resolve(data.token))
      .catch(error => {
        reject({
          message: 'error on get room token',
          error,
        });
      });
  });
}

function getTokenOptions(params: GetTokenParams) {
  const {role, user_id, room_id} = params;
  return {
    ...POST_REQUEST,
    body: JSON.stringify({
      role,
      user_id,
      room_id,
    }),
  };
}

function createRoom(params: CreateRoomParams): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(getApiUrl('/room'), createRoomOptions(params.room))
      .then(res => res.json())
      .then((room: RoomCreationResponse) => resolve(room.id))
      .catch(error => {
        reject({
          message: 'error on room creation',
          error,
        });
      });
  });
}

function createRoomOptions(room: string) {
  return {
    ...POST_REQUEST,
    body: JSON.stringify({
      room,
    }),
  };
}

export {getRoomToken, createRoom};
