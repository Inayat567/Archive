// DOCS: https://github.com/pmndrs/zustand

// global state management
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { PresenceStatusV2, PRESENCE_VALUES } from './user'
import { currentActiveState } from './utils/presenceUtils';

interface PersistantPresenceState {
    data: PresenceStatusV2,
    current: string, // parsed
    dispatch: (args: any) => void,
}

const reducer = (state: any, args: any) => {
    let data: any = { // initial state
        presence: state.data.presence,
        status: state.data.status || '',
        expiry: state.data.expiry || 0,
    };
    Object.keys(args).forEach((k)=>{
        if(k in data){
            data[k] = args[k];
        }else{
            console.error('Bad key provided', k, args[k]);
        }
    })
    return data;
}

export const usePresenceStore = create<PersistantPresenceState>()(
    devtools(
        persist(
        (set) => ({
            data: {
                presence: PRESENCE_VALUES.offline,
                status: '',
                expiry: 0,
            },
            current: '', // parsed status or presence
            dispatch: (args) => { // each change updates global state + updates firestore. TODO - might want to check it state was saved successfully
                set((state) => {
                    const data = reducer(state, args);
                    const current = currentActiveState(data);
                    return {
                        current,
                        data,
                    };
                })
            },
        }),
        {
            name: 'presence-storage-v2', // saves in local storage under this name
        }
        )
    )
)