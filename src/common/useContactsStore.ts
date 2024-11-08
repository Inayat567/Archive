import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useContactsStore = create()(
    devtools(
        persist(
        (set) => ({
            users: [],
            teams: [],
            setUsers: (_users: any[])=> set({ users: _users }),
            setTeams: (_teams: any[])=> set({ teams: _teams }),
            clearAll: ()=> set({ users: [], teams: [] }),
        }),
        {
            name: 'use-contacts-v2', // saves in local storage under this name
        }
        )
    )
)