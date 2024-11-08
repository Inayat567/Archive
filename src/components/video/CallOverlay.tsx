import Controls from "layouts/Controls";

interface Props{
    onLeave: any,
    toggleScreenshare: any,
    [key: string] : any,
}

export default function CallOverlay(props: Props){
    return (
        <div
            className="call-overlay"
          >
            <Controls classNames={'sticky'} {...props} />
          </div>
    )
}