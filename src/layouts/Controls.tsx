import { useAVToggle, useScreenShare } from '@100mslive/react-sdk';
import LeaveCallIcon from 'components/icons/calls/LeaveCallIcon';
import MuteIcon from 'components/icons/calls/MuteIcon';
import ScreenShareIcon from 'components/icons/calls/ScreenShareIcon';
import SmilyFace from 'components/icons/profile/SmilyFace';

interface Props{
  onLeave: any,
  toggleScreenshare?: any,
  classNames?: string,
}

export default function Controls(props: Props) {
  
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
  const { amIScreenSharing } = useScreenShare();

  return (
    <div className={"control-bar " + (props.classNames ? props.classNames : '')}>
      <div className='actions'>
        <button className={`toggle-mic ${!isLocalAudioEnabled ? 'active' : 'clear-light'} `}  onClick={toggleAudio}>
          <img src={MuteIcon} />
        </button>
        {/* <button className={`toggle-camera ${isLocalVideoEnabled ? 'green' : 'clear-light'}`}  onClick={toggleVideo}>
          <img src={SmilyFace} />
        </button> */}
        <button className='leave-call clear-light'  onClick={props.onLeave}>
          <img src={LeaveCallIcon} />
        </button>
        {
          props.toggleScreenshare
          &&
          <button className={`screen-share ${amIScreenSharing ? 'active' : 'clear-light'}`} onClick={props.toggleScreenshare}>
            <img src={ScreenShareIcon} />
          </button>
        }
      </div>
    </div>
  );
}
