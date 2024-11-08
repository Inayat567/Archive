import {
    useHMSStore,
    useHMSActions,
    selectLocalPeer,
    selectPeerAudioByID,
    selectSpeakers,
    selectDominantSpeaker
} from '@100mslive/react-sdk';
import { useEffect } from 'react';

export default function ActiveSpeaker(){
    /** get localpeer from store */
    const localpeer = useHMSStore(selectLocalPeer);
    /** get a given peer's audio level. */
    const peerAudioLevel = useHMSStore(selectPeerAudioByID(localpeer.id));
    console.log(`audio level for peer - ${localpeer.id} is ${peerAudioLevel}`);

    /** get all speakers. Gives back a list of all peers who are not muted. */
    const allSpeakers = useHMSStore(selectSpeakers);
    console.log('all speakers', allSpeakers);

    /** gets the active speaker */
    const dominantSpeaker = useHMSStore(selectDominantSpeaker);

    useEffect(()=>{
        console.log('dominant speaker changed', dominantSpeaker);
    }, [dominantSpeaker])


    return (
        <>
            <h1>Active Speaker</h1>
            { dominantSpeaker ?
                <span>
                    {dominantSpeaker.name}: {dominantSpeaker.id}
                </span>
                :
                null
            }
        </>
    );
};
