import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import { io, Socket } from 'socket.io-client';
import ChatContainer from '../../components/ChatContainer';
import Contacts from '../../components/Contacts';
import Welcome from '../../components/Welcome';
import apiRoutes, { host } from '../../utils/ApiRoutes';

const { usersRoute } = apiRoutes;

interface Contact {
  _id: string;
  username: string;
  avatarImage: string;
  isAvatarImageSet: boolean
}

let userKey: string = "chat-app-user";

function Chat() {
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [currentChat, setCurrentChat] = useState<Contact|undefined|null>(undefined);
  const [currentUser, setCurrentUser] = useState<Contact|undefined|null>(undefined);
  const socket = useRef<Socket>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(userKey)) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem(userKey) || ""));
    }
  },[navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id)
    }
  }, [currentUser]);

  useEffect(() => {
    (async() => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const res = await axios.get(`${usersRoute}${currentUser._id}`);
          setContacts(res.data.data);
        } else {
          navigate("/set/avatar");
        }
      }
    })();
  }, [currentUser, navigate]);

  const handleChatChange = (chat: any) => {
    setCurrentChat(current => chat);
  };

  return (
    <>
    <Container>
      <div className='container'>
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        { currentChat ? (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket.current} />
        ) : (
          <Welcome currentUser={currentUser} />
        ) }
      </div>
    </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;