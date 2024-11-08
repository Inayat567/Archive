import { UserContext } from "common/context"
import Pagination from "components/common/Pagination";
import { MAX_CONTACTS_PER_COLUMN } from "config/constants";
import useFilteredContacts from "hooks/useFilteredContacts";
import useSlicedContacts from "hooks/useSlicedContacts";
import { useContext, useState, useEffect } from "react"
import ComboViewItem from "./ComboViewItem";
import useContactsPagination from '../../hooks/useContactsPagination';
import { IContactsPagination } from '../../hooks/useContactsPagination';


interface ColumnUser{
    [key: string] : any,
}

interface Props{
    contacts: ColumnUser[],
    createCall: any,
    joinCall: any,
}


export default function ColumnMulti(props: Props){

    const { contacts, createCall, joinCall } = props;
    const pagination: IContactsPagination = useContactsPagination(contacts);
    const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

    useEffect(onChange, []);
    useEffect(onChange, [
        contacts.length, 
        pagination.index.min, 
        pagination.index.max
    ])

    function onChange(){
        const c = contacts.slice(pagination.index.min, pagination.index.max);
        setFilteredContacts(c);
    }

    return(
       <>
         { filteredContacts.length > 0 && filteredContacts.map((contact: any) => {
            return (
                <ComboViewItem 
                    contact={contact} 
                    createCall={()=>{ createCall(contact) }}
                    joinCall={()=>{ joinCall(contact) }}
                    key={contact.uid}    
                />
            )
        })}
        { 
            pagination.max > 1
            && 
            <Pagination 
                pagination={pagination.current} 
                maxPagination={pagination.max} 
                handleClick={pagination.change} /> 
        }
        
       </>
    )
}