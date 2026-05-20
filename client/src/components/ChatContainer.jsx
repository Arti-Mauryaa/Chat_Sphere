import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import ProfileDrawer from "./ProfileDrawer";
import { FaChevronLeft } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  sendMessageRoute,
  recieveMessageRoute,
} from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket, clearChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const chatMessagesRef = useRef();

  // helper to get logged-in user
  const getUser = () => {
    return currentUser;
  };

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = getUser();
        if (!user || !currentChat) return;

        const { data } = await axios.post(recieveMessageRoute, {
          from: user._id,
          to: currentChat._id,
        });

        setMessages(data);
        setShowProfile(false); // Reset profile drawer on chat change
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat]);

  // Send message
  const handleSendMsg = async (msg) => {
    try {
      const user = getUser();
      if (!user) return;

      // socket send
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: user._id,
        msg,
      });

      // save to DB
      await axios.post(sendMessageRoute, {
        from: user._id,
        to: currentChat._id,
        message: msg,
      });

      // update UI instantly
      setMessages((prev) => [
        ...prev,
        { fromSelf: true, message: msg },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Receive messages
  useEffect(() => {
    if (!socket.current) return;

    const handleMessage = (msg) => {
      setArrivalMessage({
        fromSelf: false,
        message: msg.message,
        from: msg.from,
      });
    };

    socket.current.on("msg-receive", handleMessage);

    return () => {
      socket.current.off("msg-receive", handleMessage);
    };
  }, [socket]);

  // Add incoming message to state
  useEffect(() => {
    if (arrivalMessage) {
      if (currentChat && arrivalMessage.from === currentChat._id) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <OuterWrapper>
      <Container>
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <button className="back-btn" onClick={clearChat} title="Back to Chats">
              <FaChevronLeft />
            </button>
            <div className="user-details" onClick={() => setShowProfile(!showProfile)}>
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt={currentChat.username}
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
                <span className="info-click-trigger">Click for contact details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((message) => (
            <div key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
      <ProfileDrawer
        contact={currentChat}
        show={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.chatBg};
  transition: all 0.3s ease;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 5rem 1fr 5.5rem;
  height: 100%;
  overflow: hidden;
  flex: 1;
  transition: all 0.3s ease;

  @media screen and (max-width: 768px) {
    grid-template-rows: 4rem 1fr 4.8rem;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid ${(props) => props.theme.border};
    background-color: ${(props) => props.theme.sidebarBg}44;

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-btn {
      display: none;
      background: transparent;
      border: none;
      color: ${(props) => props.theme.textPrimary};
      font-size: 1.3rem;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        color: ${(props) => props.theme.primary};
        transform: translateX(-2px);
      }

      @media screen and (max-width: 768px) {
        display: flex;
      }
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      padding: 0.4rem 0.8rem;
      border-radius: 0.8rem;
      transition: all 0.2s ease;

      &:hover {
        background-color: ${(props) => props.theme.contactHoverBg};
      }

      .avatar img {
        height: 2.8rem;
        width: 2.8rem;
        border-radius: 50%;
        border: 2px solid ${(props) => props.theme.primary};
      }

      .username {
        display: flex;
        flex-direction: column;
        
        h3 {
          color: ${(props) => props.theme.textPrimary};
          font-weight: 700;
          font-size: 1.1rem;
        }

        .info-click-trigger {
          font-size: 0.75rem;
          color: ${(props) => props.theme.primary};
          opacity: 0.8;
          font-weight: 600;
        }
      }
    }
  }

  .chat-messages {
    min-height: 0;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;

    @media screen and (max-width: 768px) {
      padding: 1rem;
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.scrollbarThumb}60;
      border-radius: 1rem;
    }

    .message {
      display: flex;
      align-items: center;
      animation: messageFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .content {
        max-width: 45%;
        overflow-wrap: break-word;
        padding: 0.9rem 1.2rem;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        line-height: 1.4;
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background: linear-gradient(135deg, ${(props) => props.theme.primary}ee 0%, ${(props) => props.theme.secondary}ee 100%);
        color: ${(props) => props.theme.messageSelfText};
        border-radius: 1.2rem 1.2rem 0.2rem 1.2rem;
        box-shadow: 0 4px 12px ${(props) => props.theme.primary}33;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: ${(props) => props.theme.messageOtherBg};
        color: ${(props) => props.theme.messageOtherText};
        border-radius: 1.2rem 1.2rem 1.2rem 0.2rem;
        border: 1px solid ${(props) => props.theme.glassBorder};
      }
    }
  }

  @keyframes messageFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;