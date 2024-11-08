import { useEffect, useState } from "react";

export function getCombinedContacts(users: any[], teams: any[], userUid: string, limit: number = 0): any[]{
    const combined = users.concat(teams)
    .filter((contact: any) => {
        return contact.uid != userUid;
    })
    if(limit > 0){
        return combined.slice(0, limit);
    }
    return combined;
}

export function getFilteredContacts(contacts: any[], userUid: string): any[]{
    return contacts.filter((contact: any) => {
        return contact.uid != userUid;
    })
}

export function getOrderedContacts(contacts: any[], orderList: string[]): any[]{
    const sorted = contacts.sort((a,b)=>{
        const A = orderList.indexOf(a.uid);
        const B = orderList.indexOf(b.uid);
        if(A > B){
            return -1;
        }else if(A < B){
            return 1;
        }
        return 0;
    });
    return sorted;
}

export function useFilteredContacts(contacts: any[], userUid: string){

    const [filtered, setFiltered] = useState<any[]>(contacts);

    useEffect(()=>{

        let f = getFilteredContacts(contacts, userUid);
        setFiltered(f);

    }, [contacts])

    return filtered;
}