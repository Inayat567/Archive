import { TEST_WITHOUT_CONNECTION } from "config/constants";
import styled from 'styled-components'
import CallIcon from 'styles/images/call-square.svg'
import CancelIcon from 'styles/images/cancel-square.svg'

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 45%;
  margin: 0 auto;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const UnderButtonMessage = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  margin-top: 10px;
  text-align: center;
`

const Button = styled.div`
  &&& {
    width: 42px;
    height: 42px;
    background: transparent;
    outline: 0 none;
    padding: 0;
    cursor: pointer;
  }
`

const Icon = styled.img`
  width: 42px;
  height: 42px;
`

interface Props{
    onAccept: any,
    onReject: any,
    [key: string]: any,
}


export default function TeamCallInvitation(props: Props){
    const { onAccept, onReject } = props;

    return (
        <ActionsContainer>
            <ButtonContainer>
            <Button onClick={onReject}>
                <Icon src={CancelIcon} />
            </Button>
            <UnderButtonMessage>
                I'm busy
            </UnderButtonMessage>
            </ButtonContainer>

            <ButtonContainer>
            <Button onClick={onAccept}>
                <Icon src={CallIcon} />
            </Button>
            <UnderButtonMessage>
                Connect
            </UnderButtonMessage>
            </ButtonContainer>
        
        </ActionsContainer>
    )
}