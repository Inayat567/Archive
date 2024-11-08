import { getDatabase, ref, onValue, get, child, push, update, set, onChildAdded } from "firebase/database";
import { realtimeDB } from "./firebaseApp";
// import { getAuth } from "firebase/auth";

interface ManyUpdateData{
    [key: string] : any,
}

// const references: any = {};

// function remember(name: string, ref: any){
//     references[name] = ref;
// }

/*
    refOne = firebase.database().ref('users/'+uid+'/items');
    refOne.on('value', function(snapshot){
        ....
    })

    // stop listening
    refOne.off('value');
*/

export function listen(name: string, callback: any){
    const db = realtimeDB();
    const eventRef = ref(db, name);
    return onValue(eventRef, (snapshot) => {
        const data = snapshot.val();
        if(data){
            callback(data);
        }
    });
}

// listen for new childrens added
export function listenForNew(name: string, callback: any){
    const db = realtimeDB();
    const dbRef = ref(db, name);
    return onChildAdded(dbRef, (data: any)=>{
        if(data){
            callback(data.val());
        }
    })
}

export function readOnce(name: string, callback: any){
    const db = realtimeDB();
    const dbRef = ref(db);
    get(child(dbRef, name)).then((snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function read(name: string): Promise<any>{
    return new Promise((resolve, reject)=>{
        const db = realtimeDB();
        const dbRef = ref(db);
        get(child(dbRef, name)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            }else{
                reject(null);
            }
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    })
}

export function listenOnce(name: string, callback: any){
    const db = realtimeDB();
    const reference = ref(db, name);
    return onValue(reference, (snapshot) => {
    // const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        if(snapshot.exists()){
            callback(snapshot.val());
        }
    }, {
        onlyOnce: true
    });
}

export function listenOnceAsync(name: string){
    const db = realtimeDB();
    const reference = ref(db, name);
    return new Promise((resolve, reject)=>{
        onValue(reference, (snapshot) => {
            if(snapshot.exists()){
                resolve(snapshot.val())
            }else{
                reject();
            }
        }, {
            onlyOnce: true
        });
    })
   
}

// export function detach(name: string, callback: any){
//     const db = realtimeDB();
//     const listener = ref(db, name);
//     listener.off(name, callback);
// }


export function writeExample(key: string, data: any){
   
}

export function updateOne(key: string, data: any){
    const db = realtimeDB();
    return new Promise((resolve, reject)=>{
        set(ref(db, key), data)
        .then(()=>{
            resolve('success');
        })
        .catch((error)=>{
            reject({
                message: 'update failed',
                error,
            })
        })
    })
}

export function updateMany(key: string, updates: any = {}){

    const db = realtimeDB();
    return new Promise((resolve, reject)=>{
        set(ref(db, key), updates)
        .then(()=>{
            resolve('success');
        })
        .catch((error)=>{
            reject({
                message: 'update failed',
                error,
            })
        })
    })
}
