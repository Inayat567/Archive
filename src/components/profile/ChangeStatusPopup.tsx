import { calcStatusExpiry } from "common/user"
import { PresenceContext, UserContext } from "common/context"
import { CustomUserStatusInterface, CUSTOM_USER_STATUSES, END_OF_TODAY } from "config/constants"
import { useContext, useEffect, useState } from "react"
import * as StatusIcons from 'components/icons/StatusIcons'
import checkMark from 'styles/images/check_mark.svg'
import { readOnce } from "firebase/firebaseCallEvents"
import { presenceKey } from "common/realtimeCallKeys"
import BackArrow from "components/icons/profile/BackArrow"
import { usePresenceStore } from 'common/userPresenceStore';

interface EXPIRY_OPTION{
    title: string,
    value: string|number,
}

const expiryOptions: EXPIRY_OPTION[] = [
    {
        title: 'Today',
        value: END_OF_TODAY,
    },
    {
        title: '30min',
        value: 30 * 60 * 1000,
    },
    {
        title: '1hour',
        value: 60 * 60 * 1000,
    },
    {
        title: '1week',
        value: 60*24*7 *60*1000,
    },
];

export default function ChangeStatusPopup(props: any){

    const { onClose } = props;
    const { user } = useContext<any>(UserContext);
    const presenceContext = useContext(PresenceContext);
    const [newExpiry, setNewExpiry] = useState<EXPIRY_OPTION>(expiryOptions[0]);
    const [newStatus, setNewStatus] = useState<string>('');
    const currentPresenceState: string = usePresenceStore((state: any)=>state.current); // current

    useEffect(init, []);
    useEffect(()=>{
        setNewStatus(currentPresenceState);
    }, [currentPresenceState])

    function init(){
        // checkUserStatus();
        const valid = CUSTOM_USER_STATUSES.find(st => st.key == currentPresenceState);
        if(valid){
            setNewStatus(currentPresenceState);
        }
        checkSavedExpiry();
    }

    function updateUserPresenceStatus(){
        if(newStatus !== null){
            const expiry = createExpiration();
            presenceContext.changeStatus(newStatus, expiry);
        }else{
            presenceContext.changeStatus('', 0)
        }       
    }

    // returns milliseconds
    function createExpiration(): number{
        return calcStatusExpiry(newExpiry.value == END_OF_TODAY ? END_OF_TODAY : newExpiry.value);
    }

    /*
        set new status
        unset existing status
        update when expiry changes
    */
    function onStatusChange(option: CustomUserStatusInterface){
        
        const toggleOff = newStatus == option?.key;
        setNewStatus(toggleOff ? '' : option.key);
    }

    function rememberExpiry(option: EXPIRY_OPTION){
        window.localStorage.setItem('remember_expiry', JSON.stringify(option))
    }
    
    function checkSavedExpiry(){
        const json = window.localStorage.getItem('remember_expiry');
        if(json){
            const val = JSON.parse(json);
            // check if it matches one of available options
            expiryOptions.forEach((curr)=>{
                if(val.title && val.value && val.title == curr.title && val.value == curr.value){
                    setNewExpiry(curr);
                }
            })
        }
    }

    function onCancel(){
        onClose();
    }

    function onSave(){
        rememberExpiry(newExpiry); // for next time? or should it just read user presence?
        updateUserPresenceStatus(); // TODO - re-enable
        onClose();
    }

    return (
        <div className="profile-status-filler">
        <div className="profile-status-popup">
            <button className="clear-light profile-status-popup__back" onClick={onCancel}>
                <img src={BackArrow} />
                <span>Whats's your status?</span>
            </button>
            <hr className="separator" />
            <ul className="statuses">
            {CUSTOM_USER_STATUSES.map((option: CustomUserStatusInterface)=>{
                if(!option.selectable){
                    return null;
                }
                let isCurrentStatus = newStatus == option.key;
                return (
                    <li key={option.key}>
                        <button onClick={()=>{ onStatusChange(option) }} className="status-button clear-light">
                           <span className="button-content">
                            <span className="icon-wrapper">
                                <img src={StatusIcons[option.key]} />
                            </span>
                            {option.title} 
                           </span>
                            <span className="selected-status">{ isCurrentStatus && <img src={checkMark} />}</span>
                        </button>
                        
                    </li>
                )
            })}
            </ul>

            <div className="clear-after-title">Clear after:</div>
            <ul className="clear-after-time">
            {expiryOptions.map((opt)=>{
                let isCurrentExpiry = opt.title == newExpiry.title;
                return (
                    <li className={(isCurrentExpiry ? 'selected' : '')} key={opt.value} >
                        <button onClick={()=>{ setNewExpiry(opt)}} className='clear-light'>
                            {opt.title}
                        </button>
                    </li>
                )
            })}
            </ul>
            <div className="status-buttons-wrapper">
                <button onClick={onCancel} className='outlined-light sm'>Cancel</button>
                <button onClick={onSave} className='green sm-plus'>Save</button>
            </div>

           
        </div>
        </div>
    )
}