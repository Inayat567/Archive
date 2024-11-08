import { useEffect, useState } from "react";


const filterThruKeys = [
    'displayName', // user
    'email', // user
    'name', // user or team
];
  
export default function useFilteredContacts(contacts: any, filterValue: string, filterKeys:string[]=filterThruKeys){

    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(()=>{
        let filtered: any = []; // filtered
        contacts.map((contact: any) => {
            if(matchesFilters(contact)){
                filtered.push(contact);
            }
        });
        setFilteredContacts(filtered);
    }, [contacts.length, filterValue]);

    function matchesFilters(contact: any){
        if(filterValue.trim().length === 0) return true;
        let valid = false;
        const lowercaseFilterValue = filterValue.toLowerCase();
        filterKeys.forEach(key => {
            if(contact[key] && String(contact[key]).toLowerCase().includes(lowercaseFilterValue)){
                valid = true;
            }
        })
        return valid;
    }

    return filteredContacts;
}