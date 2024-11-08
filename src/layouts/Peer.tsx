import { useVideo } from '@100mslive/react-sdk';
import { useState } from 'react';
import styled from 'styled-components'

const Video = styled.video`
  outline: 1px dotted grey;
`

export default function Peer(props: any) {

  const {
    peer,
    showName = true,
    containerClass = 'peer-container',
    nameClass = '',
  } = props;

  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  const [muted, setMuted] = useState<boolean>(true);

  function toggleMute(){
    setMuted(!muted);
  }

  /*
    show name
    no name
    name at the top
  */

  return (
    <div className={containerClass}>
      <Video
        ref={videoRef}
        className={`peer-video ${peer.isLocal ? 'local' : ''}`}
        autoPlay
        muted={muted}
        playsInline
      />
      
      { showName && 
        <div className={`peer-name ${nameClass}`}>
          {peer.name} {peer.isLocal ? "(You)" : ""}
        </div>
      }
    </div>
  );
}
