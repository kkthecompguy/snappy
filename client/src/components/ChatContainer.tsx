import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';
import { toast, ToastOptions } from 'react-toastify';
import axios from 'axios';
import ChatInput from './ChatInput';
import apiRoutes from '../utils/ApiRoutes';
import { Socket } from 'socket.io-client';

const { addMessageRoute, listMessageRoute } = apiRoutes;


interface Contact {
  _id: string;
  username: string;
  avatarImage: string;
  isAvatarImageSet: boolean
}


interface Props {
  currentChat: Contact|undefined|null;
  currentUser: Contact|undefined|null;
  socket: Socket|undefined;
}

interface ProjectedMessage {
  fromSelf: boolean;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const toastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};


function ChatContainer( {currentChat, currentUser, socket}: Props) {
  const [messages, setMessages] = useState<Array<ProjectedMessage>>([]);
  const scrollRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  let userId = currentUser?._id

  useEffect(() => {
    (async() => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const body = {
        from: userId,
        to: currentChat?._id
      }
      const { data } = await axios.post(`${listMessageRoute}`, body, config);
      setMessages(current => data.data);
    })();
  },[currentChat, userId]);

  useEffect(() => {
    if (socket) {
      socket.on("msg-received", (msg: string) => {
        const messageRecieved = {
          fromSelf: false,
          message: msg,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setMessages(current => [...current, messageRecieved])
      });
    }
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSendMessage = async (message: string) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const body = {
        from: currentUser?._id,
        to: currentChat?._id,
        message
      }
      await axios.post(`${addMessageRoute}`, body, config);
      socket?.emit("send-msg", body);
      setMessages(current => [...current, {fromSelf: true, message: message, createdAt: new Date(), updatedAt: new Date()}])
    } catch (error) {
      toast.error("could not send message try again", toastOptions)
    }
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`${currentChat?.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat?.username}</h3>
          </div>
        </div>
        <LogoutButton onClick={logout}><BiPowerOff /></LogoutButton>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput handleSendMessage={handleSendMessage} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default ChatContainer;