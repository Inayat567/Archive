import CenteredPopup from "components/common/CenteredPopup";


interface Props{
    onCancel: any,
    onSuccess: any,
}

export default function StopSharePopup(props: Props){

    return (
        <CenteredPopup 
            title={`Do you want to stop sharing your screen?`}
            classNames={`screenshare-stop`}
            onClose={props.onCancel}
            >
            <button onClick={props.onCancel} className="outlined-light">No</button>
            <button onClick={props.onSuccess} className="green">Yes</button>
        </CenteredPopup>
    )

}