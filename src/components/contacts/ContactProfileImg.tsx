import { currentActiveState } from 'common/utils/presenceUtils';
import ProfileImage from 'components/profile/ProfileImage';
import { useEffect, useState } from 'react';
import RemoteStatusDot from './RemoteStatusDot';

interface Props{
    user: any,
    presenceObj: any,
}

export default function ContactProfileImg(props: Props){

    const { user, presenceObj } = props;
    const [currentState, setCurrentState] = useState(currentActiveState(presenceObj));
    
    useEffect(checkState, [
        presenceObj.presence,
        presenceObj.status,
        presenceObj.expiry,
    ])
    
    function checkState(){   
        setCurrentState(currentActiveState(presenceObj));
    }

    return (
        <div className='contact-profile-image'>
            <ProfileImage user={user} />
            <RemoteStatusDot classNames={'status-dot'} currentState={currentState} />
        </div>
    )
}