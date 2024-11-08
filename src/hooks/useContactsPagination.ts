import {useEffect, useState} from 'react';
import { MAX_CONTACTS_PER_COLUMN } from '../config/constants';

const DEFAULT_PAGINATION = 1; // starts with 1

export interface IContactsPagination{
    max: number;
    current: number;
    index: {
        min: number;
        max: number;
    };
    change: (value: number) => void;
}

export default function useContactsPagination(contacts: any[]): IContactsPagination{

    const [currentPagination, setCurrentPagination] = useState(DEFAULT_PAGINATION);
    const [maxPagination, setMaxPagination] = useState(DEFAULT_PAGINATION);
    const [indexMin, setIndexMin] = useState(0); // indexes for arr
    const [indexMax, setIndexMax] = useState(MAX_CONTACTS_PER_COLUMN-1); // indexes for arr

    useEffect(()=>{
        let pgnt = calcPagination();
        setMaxPagination(pgnt < DEFAULT_PAGINATION ? DEFAULT_PAGINATION : pgnt);
    }, [contacts.length])

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
        return Math.ceil(contacts.length / MAX_CONTACTS_PER_COLUMN)
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
        const min = (currentPagination - 1) * MAX_CONTACTS_PER_COLUMN;
        setIndexMin(min > 0 ? min : 0);
        setIndexMax(currentPagination * MAX_CONTACTS_PER_COLUMN)
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