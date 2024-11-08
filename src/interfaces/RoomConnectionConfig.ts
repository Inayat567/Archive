export default interface RoomConnectionConfig{
    userName: string,
    authToken: string,
    settings?: {
        isAudioMuted?: boolean,
        isVideoMuted?: boolean,
    },
    rememberDeviceSelection? : boolean,
}