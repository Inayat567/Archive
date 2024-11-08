import ImageCallPreview from 'styles/images/login/call-preview.jpg'
import ImageMikeHall from 'styles/images/login/mikehall.jpg'


export default function AppPreview(){
    return (
        <div className="app-previews">
            <div>
                <h2 className="app-previews__title" >Work in the office, from anywhere</h2>
            </div>
            <div className="app-previews__images">
                <img src={ImageCallPreview} />
            </div>
            <div className="app-previews__reviews">
                <div className="app-previews__review-text">
                    “Photon has improved our team communication and 
                    productivity  x10. We’ve never had such an 
                    efficient way to stay connected, we can’t 
                    imagine not using it.”
                </div>
                <div className="app-previews__reviewer">
                    <img src={ImageMikeHall} />
                    <strong>Mike Hall,</strong>  Finance Manager
                </div>
            </div>
        </div>
    )
}