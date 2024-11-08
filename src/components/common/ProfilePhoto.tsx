import ProfileImage from 'components/profile/ProfileImage';
import styled from 'styled-components'

const ImageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function ProfilePhoto(props: any){

    const { user } = props;

    return (
        <ImageWrapper>
            <ProfileImage user={user} />
        </ImageWrapper>
    )
}