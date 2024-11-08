
interface Props{
    screen: any,
    onSelect: any,
    isSelected: boolean,
}

export default function ScreenPreview(props: Props){

    return (
        <div className={`screen ${props.isSelected && 'screen__selected'}`} onClick={props.onSelect}>
            <img src={props.screen.preview} alt={props.screen.name} />
            {/* <div className="screen-name">{props.screen.name}</div> */}
        </div>
    )
}