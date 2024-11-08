import { UserContext } from "common/context"
import { useContext } from "react"
import ComboViewItem from "./ComboViewItem";

interface ColumnUser{
    [key: string] : any,
}

interface Props{
    contacts: ColumnUser[],
    createCall: any,
    joinCall: any,
}

export default function ColumnSingle(props: Props){

    const { contacts, createCall, joinCall } = props;
    const { user } = useContext<any>(UserContext);

    return(
       <>
         { contacts.length > 0 && contacts.map((contact: any) => {
            if(contact.uid != user.uid){
                return (
                    <ComboViewItem 
                        contact={contact} 
                        createCall={createCall}
                        joinCall={joinCall}
                        key={contact.uid}    
                    />
                )
            }
        })}
       </>
    )
}