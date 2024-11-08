import { useVideo } from '@100mslive/react-sdk';
import { useEffect, useState } from 'react';

interface Props{
  peer: any,
  talking: boolean,
  dominant: boolean,
}

export default function TeamPeer(props: Props) {

  const { peer, talking, dominant } = props;

  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  const [outlineStyle, setOutline] = useState<string>('0 none');

  useEffect(()=>{
    if(talking && dominant){
      setOutline('2px solid green')
    }else if(talking && !dominant){
      setOutline('px solid orange');
    }else{
      setOutline('0 none');
    }
  }, [talking, dominant])

  return (
    <div className="team-peer">
      <div className='team-peer__container'>
        <div className="team-peer__video-container" >
          <video
            ref={videoRef}
            className={`team-peer-video ${peer.isLocal ? 'local' : ''}`}
            autoPlay
            muted
            playsInline
            style={{outline: outlineStyle }}
          />
          <div className="peer-name">
            {peer.name} {peer.isLocal ? "(You)" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
