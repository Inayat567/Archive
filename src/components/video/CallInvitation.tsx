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

const WhosCalling = styled.h2`
  color: white;
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
`

const Message = styled.div`
  margin-top: 10px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
`

const InvitationScreen = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const Center = styled.div`
  position: absolute;
  top: calc(50% - 20px);
  left: 50%;
  transform: translate(-50%, -50%);
`

const Bottom = styled.div`
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
`

interface Props{
    onAccept: any,
    onReject: any,
    person?: string,
    [key: string]: any,
}


export default function CallInvitation(props: Props){
    const { onAccept, onReject, isConnected, debug, person } = props;

    return (
        <InvitationScreen>
            <Center>
              <WhosCalling>
                { person ? person : 'Incoming...' }
              </WhosCalling>
              <Message>Chat request</Message>
            </Center>

            { isConnected || TEST_WITHOUT_CONNECTION 
              ? 
              <Bottom>
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
              </Bottom>
            :
            null
            }
        </InvitationScreen>
    )
}