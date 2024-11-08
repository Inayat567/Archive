import { companyUsersStateKey } from './realtimeCallKeys';
import * as RDB from 'firebase/firebaseCallEvents'

export  function companyStateListener(companyId: string, callback: any){
    const companyKey = companyUsersStateKey(companyId); 
    return RDB.listenForNew(companyKey, (dataObj: any)=>{
      callback(dataObj);
    });
}
