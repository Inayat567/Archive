import styled from 'styled-components';

export const Title = styled.div`
    color: white;
    padding-left: 10px;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
export const FavTitle = styled.div`
    color: black;
    padding-left: 10px;
    font-weight: 500;
    font-size: 8px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
`
export const Image = styled.img`
    position: relative;
    width: 36px;
    height: 36px;
`

const Button = styled.button`
    position: relative;
    margin-left: auto !important;
    background: #9CD78D;
    height: 31px;
    width: 31px;
    min-width: 31px;
    padding: 0 !important;
    margin: 0;
    opacity: 0.8;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;  
`

export const ButtonGreen = styled(Button)`
    background: #9CD78D;
    &:hover{
        background: #9CD78D !important;
    }
`

export const ButtonGrey = styled(Button)`
    background: #727272;
    cursor: default;
    cursor: not-allowed;
    &:hover{
        background: #727272 !important;
    }
`

export const BusyImg = styled.img`
        width: 20px;
        height: 20px;
`

export const ButtonBusy = styled(Button)`
    background: #89B77D;
    &:hover{
        background: #89B77D !important;
    }
`

export const Icon = styled.img`
    width: 19px;
    height: 19px;
`

export const Notification = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: grey;
`

export const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
    margin-bottom: 4px;

    /* &:hover:not(.disabled-hovers){
        ${Title}{
            color: yellow;
        }
        ${Icon}{
            cursor: pointer;
            transform: translateY(1px);
        }
    } */
`
