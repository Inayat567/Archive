import CenteredPopup from "components/common/CenteredPopup";

interface Props{
    visible: boolean,
    onCancel: any,
    onSuccess: any,
}

export default function SignOutPopup(props: Props){
    if(props.visible){
        return (
            <CenteredPopup
                title={`Sign out`}
                message={`Are you sure you'd like to sign out of Photon?`}
                classNames={`sign-out-popup`}
                onClose={props.onCancel}
                >
                <button onClick={props.onCancel} className="outlined-light">Cancel</button>
                <button onClick={props.onSuccess} className="green">Sign Out</button>
            </CenteredPopup>
        )
    }
    return null;
}