import CloseWhite from "components/icons/CloseWhite";

interface Props{
    title?: string,
    message?: any,
    children: any, // buttons
    classNames?: string,
    onClose?: any,
    image?: string,
}

export default function CenteredPopup(props: Props){

    return (
        <div className={`centered-popup ${props.classNames}`}>
            <div className="blur-bg"></div>
            <div className="centered-popup__wrapper">
            <div className="centered-popup__container">
                {
                    props.onClose
                    &&
                    <div className="centered-popup__close">
                        <img src={CloseWhite} onClick={props.onClose}/>
                    </div>
                }
                {
                    props.image 
                    && 
                    <div className="centered-popup__image">
                       <img src={props.image} />
                    </div>
                }
               {
                props.title 
                && 
                <div className="centered-popup__title">
                    { props.title }
                </div>
               }
                {
                    props.message
                    &&
                    <div className="centered-popup__message">
                        { props.message }
                    </div>
                }
                <div className="centered-popup__actions">
                    { props.children }
                </div>
            </div>
        </div>
    </div>
    )
}