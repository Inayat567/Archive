import { useHMSStore, selectPeers, selectIsConnectedToRoom } from '@100mslive/react-sdk';
import {useEffect, useState} from 'react';

const MAX_PEERS_PER_PAGINATION = 3;
const DEFAULT_PAGINATION = 1; // starts with 1

export interface IPeersPagination{
    max: number;
    current: number;
    index: {
        min: number;
        max: number;
    };
    change: (value: number) => void;
}

export default function usePeersPagination(): IPeersPagination{

    const peers = useHMSStore(selectPeers);
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const [currentPagination, setCurrentPagination] = useState(DEFAULT_PAGINATION);
    const [maxPagination, setMaxPagination] = useState(DEFAULT_PAGINATION);
    const [indexMin, setIndexMin] = useState(0); // indexes for arr
    const [indexMax, setIndexMax] = useState(MAX_PEERS_PER_PAGINATION-1); // indexes for arr

    // adjust max pagination based on peers connected
    useEffect(()=>{
        if(isConnected){
            let pgnt = calcPagination();
            setMaxPagination(pgnt < DEFAULT_PAGINATION ? DEFAULT_PAGINATION : pgnt);
        }else{
            setMaxPagination(DEFAULT_PAGINATION);
        }
    }, [isConnected, peers])

    // make sure that current pagination does not exceed max pagination
    useEffect(()=>{
        const changed = check();
        if(changed){
            calcIndexes();
        }
    }, [maxPagination])

    useEffect(()=>{
        calcIndexes();
    }, [currentPagination])

    function calcPagination(){
        return Math.ceil(peers.length / MAX_PEERS_PER_PAGINATION)
    }

    function changePagination(value: number): void{
        const valid = isValidPagination(value);
        if(!valid){
            return;
        }
        setCurrentPagination(value);
    }

    function isValidPagination(value: number){
        return value >= DEFAULT_PAGINATION && value <= maxPagination;
    }

    function check(){
        let changed = false;;
        if(currentPagination > maxPagination){
            setCurrentPagination(maxPagination);
            changed = true;
        }
        return changed;
    }

    function calcIndexes(){
        const min = (currentPagination - 1) * MAX_PEERS_PER_PAGINATION;
        setIndexMin(min > 0 ? min : 0);
        setIndexMax(currentPagination * MAX_PEERS_PER_PAGINATION)
    }

    return {
        max: maxPagination,
        current: currentPagination,
        change: changePagination,
        index:{
            min: indexMin,
            max: indexMax,
        }
    };
}