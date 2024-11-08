import ForgotIcon from "components/icons/auth/ForgotIcon";

interface Props{
    onSubmit: any,
    email?: string,
}

export default function ResetPasswordForm(props: Props){

    return(
        <div className='form-contents'>
            <form onSubmit={props.onSubmit}>
                <div className="form-element">
                    <label>Email</label>
                    <input
                        name="email"
                        id="email"
                        type="text"
                        placeholder="Enter email"
                    />
                </div>
                <div>
                    <button type="submit" className='full'>
                    Send reset link
                    </button>
                </div>
            </form>
        </div>
    )
}