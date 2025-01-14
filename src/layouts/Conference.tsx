import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import Peer from './Peer';

export default function Conference() {
  const peers = useHMSStore(selectPeers);
  return (
    <div className="conference-section">
      <div className="peers-container">
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} /> 
        ))}
      </div>
    </div>
  );
}
