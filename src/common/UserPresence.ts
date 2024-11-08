
import { presenceKey } from "common/realtimeCallKeys";
import { PresenceStatusV2, PRESENCE_VALUES } from "common/user";
import { listen, listenOnceAsync, updateOne } from "firebase/firebaseCallEvents";
import UserTeamsPresence from "./UserTeamsPresence";
import { detectConnectionState } from "firebase/firebasePresence";
import { isOnline, onlineOrBusy } from 'common/utils/presenceUtils'
import { getTeamsUserBelongsTo } from 'firebase/firebaseCompany';
import { companyUsersStateKey } from './realtimeCallKeys'

export default class UserPresence{

    presence: string = PRESENCE_VALUES.offline;
    status: string = '';
    expiry: number = 0;
    user: any;
    teams: any[] | null;
    onChange: any;
    presenceListener: any = null;
    teamPresence: any = null;
    connectionListener: any = null;
    initialized: boolean = false;

    constructor(user: any, onChangeCallback: any){
        this.user = user;
        this.onChange = onChangeCallback;
        this.teams = null
        this.init();
    }

    async init(){

        await this.initTeamPresence()
        
        const current = await this.checkCurrent().catch(err => { /* ignored, because will bet set below */});
        const skipCallback = true;

        if(current){
            const presence = onlineOrBusy(current); // update if presence is offline
            const status = current.status === undefined ? '' : current.status; // might not be set for first time users
            const expiry = current.expiry === undefined ? 0 : current.expiry; // might not be set for first time users

            await this.changePresence(presence, skipCallback);

            this.set({
                presence,
                status,
                expiry
            });

            this.afterChange(); // skipCallback on changePresence, but trigger afterChange here

        }else{
            await this.changePresence(PRESENCE_VALUES.online, skipCallback);

            this.afterChange();
        }
       

        this.listen();
        this.listenForDisconnects();
        this.newUserConnected()

        setTimeout(()=>{
            this.initialized = true;
        }, 2000);
    }

    async initTeamPresence(){
        const teams = await getTeamsUserBelongsTo(this.user.uid, this.user.companies)
        if(teams){
            this.teams = teams.map((t) => t.uid)
            this.teamPresence = new UserTeamsPresence(this.user, this.teams);
        }
        return Promise.resolve()
    }

    listenForDisconnects(){

        if(this.connectionListener){
            this.connectionListener(); // stop previuos
        }

        this.connectionListener = detectConnectionState((connected: boolean)=>{
            if(!connected){
                this.onReconnection();
            }else if(this.initialized){ // without initialized it triggers offline check on init
                this.changePresence(PRESENCE_VALUES.offline);
            }
        });

    }

    async checkCurrent(): Promise<PresenceStatusV2>{
        const presenceRef = presenceKey(this.user.uid)
        return listenOnceAsync(presenceRef);
    }

    // user has lost connection, but now is back
    // need to check current status and update presence based on that
    async onReconnection(){
        const presenceRef = presenceKey(this.user.uid)
        listenOnceAsync(presenceRef)
        .then((presenceObj: PresenceStatusV2)=>{
            if(presenceObj && !isOnline(presenceObj)){
                this.changePresence(PRESENCE_VALUES.online);
            }
        })
        .catch((err)=> {/* doesnt matter */})
    }

    destroy(){
        this.stopPresenceListener();

        if(this.connectionListener){
            this.connectionListener();
        }
    }

    stopPresenceListener(){
        if(this.presenceListener !== null){
            this.presenceListener(); // stop
            return true;
        }
        return false;
    }

    stopConnectionListener(){
        if(this.connectionListener !== null){
            this.connectionListener();
        }
    }

    // listen for changes
    listen(){
        let check = this.stopPresenceListener();
        this.presenceListener = listen(presenceKey(this.user.uid), (data: PresenceStatusV2)=>{
            if(data && this.initialized){
                this.set(data);
            }
        })
    }

    async changePresence(presence: string, skipCallback=false){

        if(!this.isValidPresence(presence)){
            console.error("not a valida presence", presence, PRESENCE_VALUES);
            return;
        }

        const refPresenceDeep = presenceKey(this.user.uid, '/presence')
        await updateOne(refPresenceDeep, presence).catch(err => this.handleError('Error while updating presence', err))
        
        // if error wasnt thrown it is safe to update presence locally
        this.set({
            presence
        })

        if(!skipCallback){
            this.afterChange();
        }

        return true;
    }

    async changeStatus(status: string, expiry: number = 0){

        const presence = onlineOrBusy({ presence: this.presence, status, expiry});
        const presenceObj = this.data(presence, status, expiry);
        const refPresence = presenceKey(this.user.uid)
        await updateOne(refPresence, presenceObj).catch(err => this.handleError('Error while updating status', err));


        await this.set({
            presence,
            status,
            expiry
        })

        this.afterChange();
    }

    afterChange(presenceObj = this.data()){
        if(this.teamPresence){
            this.teamPresence.update(presenceObj); // TODO1
        }
        if(this.onChange){
            this.onChange(presenceObj);
        }
    }

    handleError(errorMessage: string, err: any){
        // throw new Error(err);
        console.error(err);
        alert(errorMessage);
    }

    isValidPresence(presence: string){
        let valid = false;
        Object.entries(PRESENCE_VALUES).forEach(([_, value])=> {
            if(value == presence){
                valid = true;
            }
        });
        return valid;
    }


    async set(data: any){
        if('presence' in data){
            this.presence = data.presence;
        }
        if('status' in data){
            this.status = data.status;
        }
        if('expiry' in data){
            this.expiry = parseInt(data.expiry);
        }
    }

    data(
        presence: string = this.presence, 
        status:string = this.status, 
        expiry: number = this.expiry
    ){
        return {
            presence,
            status,
            expiry,
        }
    }

    async newUserConnected(state: number|string = 1){
        if(this.user.companies && this.user.companies[0]){
            const refKey = companyUsersStateKey(this.user.companies[0]) + '/' + this.user.uid
            await updateOne(refKey, state)
        }
    }
}