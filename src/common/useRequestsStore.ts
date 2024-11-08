import { ITeamAdditionalRquest, IPrivateAdditionalRequest } from 'interfaces/AdditionalRequestTypes';
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface IReqStore{
    pendingRedirect: null|string;
    pendingRequest: null|IPrivateAdditionalRequest|ITeamAdditionalRquest;
    dispatch: any;
}

export const useRequestsStore = create<IReqStore>()(
    devtools(
        persist(
            (set) => ({
                pendingRedirect: null,
                pendingRequest: null,
                dispatch: (type: string, args: any) => { // each change updates global state + updates firestore. TODO - might want to check it state was saved successfully
                    if(type == 'pendingRequest'){
                        set({ pendingRequest: args})
                    }else if(type == 'pendingRedirect'){
                        set({ pendingRedirect: args })
                    }else if(type == 'reset'){
                        set({
                            pendingRequest: null,
                            pendingRedirect: null,
                        })
                    }else{
                        console.error('409 invalid type for useRequestsStore.dispatch -> ', type, args);
                    }
                },
            }),
            {
                name: 'useRequestsStore-v1', // saves in local storage under this name
            }
        )
    )
)