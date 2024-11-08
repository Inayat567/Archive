import Loading from 'components/icons/Loading';
import GoogleIcon from 'components/icons/auth/GoogleIcon';

interface Props{
    onClick: any,
    loading: boolean,
    classNames?: string,
}

export default function SocialLoginButton(props: Props){

    const { onClick, loading } = props;

    return (
        <div className='social-login'>
            <button type="button" onClick={onClick} disabled={loading} className={`full auth-button with-loader ${loading ? 'loading' : ''} ${props.classNames && props.classNames}`}>
                <span>
                    <img src={GoogleIcon} className='icon' /> Sign in with Google
                </span>
                <img src={Loading} className='loading-animation' />
            </button>
        </div>
    )
}