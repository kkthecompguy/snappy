import styled from "styled-components";
import Robot from '../assets/robot.gif';

interface Contact {
  _id: string;
  username: string;
  avatarImage: string;
  isAvatarImageSet: boolean
}

interface Props {
  currentUser: Contact|undefined|null
}


function Welcome({ currentUser }: Props) {
  return (
    <Container>
      <img src={Robot} alt="robot" />
      <h1>
        Welcome, <span>{currentUser?.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  img {
    height: 20rem
  }
  span {
    color: #4e0eff
  }

`;

export default Welcome;