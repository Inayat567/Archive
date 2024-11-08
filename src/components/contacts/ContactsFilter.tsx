import SearchIcon from "components/icons/SearchIcon";
import { useState, useRef, useEffect } from 'react';

interface Props{
    onChange: any,
    defaultExpanded?: boolean,
}

export default function ContactsFilter(props: Props){

    const { onChange } = props;
    const [inputValue, setInputValue] = useState('');
    const [expanded, setExpanded] = useState(props?.defaultExpanded || false);
    const searchInput = useRef(null);

    useEffect(()=>{
        if(expanded){
            setTimeout(()=>{
                if(searchInput != null){
                    searchInput.current.focus();
                }
            }, 50)
        }
    }, [expanded])

    function inputValueChanged(event: any){
        const val = event.target.value;
        setInputValue(val);
        onChange(val);
    }

    if(expanded){
        return (
            <div className='contact-filter-input'>
                <img src={SearchIcon} className='filter-icon' />
                <input 
                    className='form-input'
                    value={inputValue}
                    onChange={inputValueChanged}
                    placeholder="Search for contact"
                    ref={searchInput}
                    autoFocus
                />
            </div>
        )
    }
    return (
        <button className="expand-contact-filter" onClick={()=>{ setExpanded(true)} }>
            <img src={SearchIcon} className='filter-icon' />
        </button>
    )
}