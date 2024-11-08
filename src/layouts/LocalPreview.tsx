import { ReactNode } from 'react';
import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import Peer from './Peer';
import styled from 'styled-components'

const VideoPreviewContainer = styled.div`
  position: fixed;
  left: 10px;
  top: 5px;
`

const VideoPreview = styled.div`
  width: 80px;
  height: 80px;
`

const PreviewText = styled.div`
  font-size: 10px;
`

interface Props{
  visible: boolean,
  children: ReactNode,
}

export default function LocalPreview(props: Props) {

  /*
    on caller side (outgoing) peers are only visible after acceptance
    on receiver side (incoming) peers are always visibile
  */
  const { 
    visible, 
    children,
  } = props;
  
  const peers = useHMSStore(selectPeers);

  if(!visible){
    return null;
  }
  return (
    <VideoPreviewContainer>
      <VideoPreview>
        <PreviewText>Preview</PreviewText>
        {peers.map((peer) => (
          peer.isLocal && <Peer key={peer.id} peer={peer} showName={false} containerClass={`local-preview-container`}/> 
        ))}
      </VideoPreview>
      {children}
    </VideoPreviewContainer>
  );
}
