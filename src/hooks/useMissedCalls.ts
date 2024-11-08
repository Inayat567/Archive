import { useEffect, useState } from "react";
import useConstructor from "./useConstructor";
import * as RDB from 'firebase/firebaseCallEvents';

/*
    single person to person missed call check
*/
export function useMissedCall(from: string, to: string){

    const [missedCall, setMissed] = useState(false);
    let stopMissedListener = ()=>{};

    useConstructor(()=>{
        check();
        stopMissedListener = listen();
    })

    function check(){
        RDB.readOnce(buildKey(from, to), (val: string)=>{
            if(val) setMissed(true);
        })
    }
    
    function listen(){
        return RDB.listen(buildKey(from, to), (value: string)=>{
            if(!!value) setMissed(true);
        })
    }

    return {
        missedCall,
        stopMissedListener
    }
}

/*
    multiple missed calls on user
*/

export function useMissedCalls(userUid: string){

    const [counter, setCounter] = useState(0);
    let stopMissedCallsListener = ()=>{};

    useConstructor(()=>{
        check();
        stopMissedCallsListener = listen();
    })

    function evaluate(data: any){
        let totalCount = 0;
        try{
            Object.entries(data).forEach(([key, value])=>{
                if(value > 0)
                    totalCount += 1;
            })
            setCounter(totalCount);
        }catch(err){
            console.error(err);
        }
    }

    function check(){
        RDB.readOnce(buildKeySingle(userUid), (data: any)=>{
            if(data) evaluate(data);
        })
    }
    
    function listen(){
        return RDB.listen(buildKeySingle(userUid), (data: any)=>{
            if(data) evaluate(data);
        })
    }

    return{
        missedCounter: counter,
        stopMissedCallsListener,
    }
}

export function checkForMissedCall(from: string, to: string): Promise<any>{
    const key = buildKey(from, to);
    return RDB.read(key);
}

export function setMissedCall(from: string, to: string){
    const key = buildKey(from, to);
    const now = Date.now();
    RDB.updateOne(key, now);
}

export function removeMissedCall(from: string, to: string){
    const key = buildKey(from, to);
    RDB.updateOne(key, null);
}

/*
    from - person who called
    to - person who missed
*/
function buildKey(from: string, to: string){
    return `missed_calls/${to}/${from}`
}

function buildKeySingle(userUid: string){
    return `missed_calls/${userUid}`
}