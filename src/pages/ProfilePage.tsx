import { UserContext } from "common/context";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileImage from "components/profile/ProfileImage";
import EditName from "components/icons/profile/EditName";
import ProfilePresense from "components/profile/ProfilePresence";
import SmilyFace from "components/icons/profile/SmilyFace";
import DoNotDisturb from "components/icons/profile/DoNotDisturb";
import ForgotIcon from "components/icons/profile/ForgotIcon";
import EditEmailIcon from "components/icons/profile/EditEmailIcon";
import SignOutPopup from "components/profile/SignOutPopup";
import ChangeStatusPopup from "components/profile/ChangeStatusPopup";
import useDoNotDisturbtMode from "hooks/useDoNotDisturbMode";
import { usePresenceStore } from "common/userPresenceStore";
import { STATUS_DO_NOT_DISTURB } from "config/constants";

import { LOGOUT_ROUTE, PROFILE_CHANGE_EMAIL_ROUTE, PROFILE_CHANGE_NAME_ROUTE, PROFILE_FORGOT_PASSWORD_ROUTE } from "config/routes";
import ProfileImageWithUpload from "components/profile/ProfileImageWithUpload";
import { useAvailablePresence } from "hooks/useAvailablePresence";
import * as StatusIcons from 'components/icons/StatusIcons'
import { CUSTOM_USER_STATUSES } from "config/constants";

export default function ProfilePage() {

  const { user, setUser } = useContext<any>(UserContext);
  const navigate = useNavigate();
  const presenceObj = usePresenceStore((state: any) => state.data);
  const [ready, setReady] = useState(false)
  const [dnd, setDnd] = useState<boolean>(presenceObj.status == STATUS_DO_NOT_DISTURB);
  const useDnd = useDoNotDisturbtMode(dnd, !ready);
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState<boolean>(false);
  const isAvailable = useAvailablePresence(presenceObj);

  useEffect(()=>{
    if(user && !ready){
        setReady(true) // without this check, it resets useDoNotDisturbtMode early and sets presence to online even if user was busy previuosly 
    }
  }, [])

  function toggleStatusChange(){
    setShowStatusPopup(!showStatusPopup);
  }

  function askLogoutConfirmation(){
    setLogoutPopupVisible(true);
  }

  function onLogoutConfirmation(){
    navigate(LOGOUT_ROUTE);
  }

  if(user){

    if(showStatusPopup){
       return <div className='profile-page '>
                <ChangeStatusPopup onClose={()=>{ toggleStatusChange() }} />
              </div>
    }

    return <div className='profile-page '>
      <div className={"profile-page__size-limiter " + (logoutPopupVisible && 'blur-section')}>

      <div className='profile-page__hero spacing'>
        
       <ProfileImageWithUpload />

        <div className="profile-info">
          <div className="profile-name">
              {user.name}
              <Link className="clear-light edit" to={PROFILE_CHANGE_NAME_ROUTE}>
                <img src={EditName} />
              </Link>
          </div>
          <div className="profile-status">
              <ProfilePresense />
          </div>
        </div>
      </div>

      <div className="update-status-button spacing">
        <button className="change-status clear-light" onClick={toggleStatusChange}>
            {
              isAvailable
              ?
              <>
                <img src={SmilyFace} className="status-icon" /> Update your status
              </>
              :
              <>
                {
                  StatusIcons[presenceObj.status]
                  ?
                  <img src={StatusIcons[presenceObj.status]} /> 
                  :
                  <img src={SmilyFace} />
                }
                {
                  CUSTOM_USER_STATUSES.find(s => {
                    return s.key == presenceObj.status
                  })?.title
                }
              </>
            }
            
        </button>
      </div>

      <div className="separator"></div>

      <div className="profile-tools spacing">
        <div className="profile-tools__item">
          <div className="profile-tools__item-align">
            <img src={DoNotDisturb} className="icon-disturb" />
            Do not disturb mode
          </div>
          <div>
          <label className="switch style-white-orange">
            <input type="checkbox" checked={useDnd} onChange={()=>{/* this input is invisible, but console error annoys me */}}/>
            <span className="slider round" onClick={()=>{ setDnd(!dnd) }}></span>
          </label>
          </div>
        </div>
        <div className="profile-tools__item">
            <Link to={PROFILE_FORGOT_PASSWORD_ROUTE} className="profile-tools__item-align">
              <img src={ForgotIcon} />
              Forgot password?
            </Link>
        </div>
        <div className="profile-tools__item">
           <Link to={PROFILE_CHANGE_EMAIL_ROUTE} className="profile-tools__item-align">
              <img src={EditEmailIcon} className="icon-edit" />
              Edit email address
           </Link>
        </div>
      </div>

      <div className="separator"></div>

      <div className="profile-tools spacing">
        <div className="profile-tools__item">
          <button onClick={askLogoutConfirmation} className="like-link clear-light">Sign out of PHOTON</button>
        </div>
      </div>
    
      </div>
      {
        logoutPopupVisible && <SignOutPopup visible={logoutPopupVisible} onSuccess={onLogoutConfirmation} onCancel={()=>{ setLogoutPopupVisible(false)}} />
      }
    </div>
    ;
  }

  return null;
}
