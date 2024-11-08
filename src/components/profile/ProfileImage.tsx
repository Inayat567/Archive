import { useUserImage } from "common/utils/userUtils";

interface Props{
    user: any,
}

export default function ProfileImage(props: Props){

    const { user } = props;

    let profileImage = useUserImage(user);

    return(
        <img src={profileImage} className="profile-image" alt={props?.user?.email}/>
    )
}