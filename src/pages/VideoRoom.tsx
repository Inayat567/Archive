import { useEffect } from 'react';
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from '@100mslive/react-sdk';

import Conference from 'layouts/Conference';
import JoinForm from 'layouts/JoinForm';
import Controls from 'layouts/Controls';

export default function VideoRoom() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        onLeave();
      }
    };
  }, [hmsActions, isConnected]);

  function onLeave(){
    hmsActions.leave();
  }

  return (
    <>
      {isConnected ? (
        <>
          <Conference />
          <Controls onLeave={onLeave} />
        </>
      ) : (
        <JoinForm />
      )}
    </>
  );
}
