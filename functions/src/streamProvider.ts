const jwt = require('jsonwebtoken');
const uuid4 = require('uuid4');
const { HMSSDK } = require('@100mslive/server-sdk');
const dotenv = require('dotenv');
const env: any = dotenv.config().parsed;

interface TokenParams{
    role: string; // user|guest
    room_id: string;
    user_id: string;
    [key: string]: any;
}

interface RoomParams{
    room: string, // send user.uid or team.uid for room creation
    // private: boolean,
}

// docs: https://www.100ms.live/docs/javascript/v2/foundation/security-and-tokens
function getToken(params: TokenParams){

    const { role, room_id, user_id } = params;

    const payload = {
        access_key: env.HMS_ACCESS_KEY,
        room_id: room_id,
        user_id: user_id,
        role: role,
        type: 'app',
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000)
    };

    return new Promise((resolve, reject)=>{
        jwt.sign(
            payload,
            env.HMS_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '24h',
                jwtid: uuid4()
            },
            function (err: any, token: string) {
                if(err) reject(err);
                resolve({ token })
            }
        );
    })
}

function createRoom(params: RoomParams){
    const payload = {
        name: params.room,
        template_id : env.HMS_TEMPLATE_ID,
        region: 'eu',
    }
    return getRoomService().createRoom(payload);
}

function getRoom(params: RoomParams){
    return getRoomService().getRoomByName(params.room);
}

function getRoomService(){
    const sdk = new HMSSDK(env.HMS_ACCESS_KEY, env.HMS_SECRET);
    return sdk.getRoomService();
}


module.exports = {
    getToken,
    createRoom,
    getRoom,
};