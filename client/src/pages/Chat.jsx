import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const [unreadMessages, setUnreadMessages] = useState({});

  // Ref to track currentChat dynamically without stale closure in socket listener
  const currentChatRef = useRef(currentChat);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  // ✅ Get user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(
      process.env.REACT_APP_LOCALHOST_KEY
    );

    if (!stored) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(stored));
    }
  }, [navigate]);

  // ✅ Setup socket connection and global unread message badge listener
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      // Listen for incoming messages globally to update unread badge counts
      socket.current.on("msg-receive", (msg) => {
        const activeChat = currentChatRef.current;
        if (!activeChat || msg.from !== activeChat._id) {
          setUnreadMessages((prev) => ({
            ...prev,
            [msg.from]: (prev[msg.from] || 0) + 1,
          }));
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-receive");
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  // ✅ Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const { data } = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            setContacts(data);
          } else {
            navigate("/setAvatar");
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setUnreadMessages((prev) => ({ ...prev, [chat._id]: 0 }));
  };

  return (
    <Container>
      <div className="container">
        <div className={`sidebar-section ${currentChat !== undefined ? "hide-mobile" : ""}`}>
          <Contacts
            contacts={contacts}
            changeChat={handleChatChange}
            currentUser={currentUser}
            onProfileUpdate={setCurrentUser}
            unreadMessages={unreadMessages}
          />
        </div>
        <div className={`chat-section ${currentChat === undefined ? "hide-mobile" : ""}`}>
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              clearChat={() => setCurrentChat(undefined)}
              currentUser={currentUser}
            />
          )}
        </div>

      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.bgGrad};
  transition: all 0.5s ease;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .container {
    height: 85vh;
    height: 85dvh;
    width: 85vw;
    width: 85dvw;
    background: ${(props) => props.theme.containerBg};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${(props) => props.theme.glassBorder};
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    display: grid;
    grid-template-columns: 25% 75%;
    transition: all 0.3s ease;

    .sidebar-section {
      height: 100%;
      overflow: hidden;
    }

    .chat-section {
      height: 100%;
      overflow: hidden;
    }

    @media screen and (min-width: 768px) and (max-width: 1200px) {
      grid-template-columns: 32% 68%;
      width: 95vw;
      width: 95dvw;
      height: 90vh;
      height: 90dvh;
      border-radius: 1.2rem;
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: 100%;
      height: 100vh;
      height: 100dvh;
      width: 100vw;
      width: 100dvw;
      border-radius: 0;
      border: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .hide-mobile {
        display: none !important;
      }
    }
  }
`;