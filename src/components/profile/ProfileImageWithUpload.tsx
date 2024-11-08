import ProfileImage from "./ProfileImage";
import UploadIcon from 'styles/images/profile/upload_icon.svg'
import { useContext, useEffect, useRef, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserContext } from "common/context";
import { getUserInfo, updateUserImage } from "firebase/firebaseUser";
import Spinner from "components/icons/Spinner";


export default function ProfileImageWithUpload(props: any){

    const { user, setUser } = useContext<any>(UserContext);
    const fileUploadRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(()=>{
        onFileUpload();
    }, [selectedFile])

    function showFiles(){
        fileUploadRef.current.click();
    }

    function onFileChange(event: any){
        setSelectedFile(event.target.files[0]);
    }

    function onFileUpload(){
        if(selectedFile != null && !busy){
            uploadToStorage(selectedFile);
            setBusy(true);
        }
    }

    function uploadToStorage(file: any){

        // Create a root reference
        const storage = getStorage();

        const ext = file.type.split('/')[1];

        const path = `images/${user.uid}/${Date.now()}.${ext}`; // user_folder/{timestamp}.{extension}
        const storageRef = ref(storage, path); // all goes to user folder

        uploadBytes(storageRef, file)
            .then(afterUpload)
            .catch(err => {
                alert(err);
                setBusy(false);
            })

    }

    function afterUpload(snapshot: any){
        if(snapshot.ref){
            getDownloadURL(snapshot.ref)
            .then(async (customImage) => {

                updateUserImage(user.uid, customImage)
                .then(()=>{
                    setUser({
                        ...user,
                        customImage,
                    });
                    setBusy(false);
                })
                .catch(err => {
                    console.error(err);
                    setBusy(false);
                    alert(err);
                });

            });
        }
    }


    return (
        <button className="profile-image-change">
            {
                !busy && <ProfileImage user={user} />
            }
            {
                busy 
                ?
                    <div className="profile-image-change__busy">
                        <img src={Spinner}  onClick={showFiles}  />
                    </div>
                :
                    <div className="profile-image-change__hover">
                       <img src={UploadIcon}  onClick={showFiles}  />
                    </div>
            }

            <input 
                type="file" 
                ref={fileUploadRef} 
                onChange={onFileChange} 
                accept="image/jpeg, image/png, image/jpg"
                />
        </button>
    )

}