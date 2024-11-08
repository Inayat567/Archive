import { useEffect, useState } from "react";
import { usePresenceStore } from 'common/userPresenceStore';
import { getStatusTitle } from "common/utils/presenceUtils";
import StatusDot from "./StatusDot";

export default function ProfilePresense(){

    const [title, setTitle] = useState('');
    const currentState = usePresenceStore((state: any) => state.current);

    useEffect(onChange, [currentState]);

    function onChange(){
        const _title = getStatusTitle(currentState);
        setTitle(_title ? _title : capitalize(currentState));
    }

    function capitalize(str: string): string{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div>
            <StatusDot classNames={'presence-identicator'} />
            <span className="presence-status">{ title }</span>
        </div>
    )
}