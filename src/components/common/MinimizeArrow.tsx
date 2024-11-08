import ChevronDownWhite from 'components/icons/ChevronDownWhite';
import ArrowDown from 'components/icons/header/ArrowDown';

export function MinimizeArrow(props: any){

    const { toggleMinimize, theme = 'dark' } = props;

    return (
        <button onClick={toggleMinimize} className="clear-light minimized-arrow">
            {
                theme == 'dark' 
                ?
                <img src={ArrowDown} className="arrow-down" /> 
                :
                <img src={ChevronDownWhite} className="arrow-down" />
            }
            
        </button>
        )
}