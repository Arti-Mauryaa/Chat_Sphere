import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="picker-wrapper">
              <Picker onEmojiClick={handleEmojiClick} disableSearchBar={false} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.sidebarBg}66;
  border-top: 1px solid ${(props) => props.theme.border};
  padding: 0 2rem;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  position: relative;
  gap: 1rem;
  height: 100%;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding: 0 1rem;
    padding-bottom: calc(0.3rem + env(safe-area-inset-bottom, 0px));
    gap: 0.5rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.textPrimary};
    gap: 1rem;

    .emoji {
      position: relative;
      display: flex;
      align-items: center;

      svg {
        font-size: 1.6rem;
        color: ${(props) => props.theme.primary};
        cursor: pointer;
        transition: all 0.2s ease;
        filter: drop-shadow(0 0 4px ${(props) => props.theme.primary}33);

        &:hover {
          transform: scale(1.1);
          filter: brightness(1.1) drop-shadow(0 0 6px ${(props) => props.theme.primary}66);
        }
      }

      .picker-wrapper {
        position: absolute;
        bottom: 3.5rem;
        left: 0;
        z-index: 100;
        animation: pickerFade 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        @media screen and (max-width: 500px) {
          position: absolute;
          left: -1rem;
          bottom: 4rem;
          width: calc(100vw - 2rem);
          max-width: 320px;

          .emoji-picker-react {
            width: 100% !important;
          }
        }
      }

      .emoji-picker-react {
        background-color: ${(props) => props.theme.emojiPickerBg} !important;
        box-shadow: 0 10px 30px ${(props) => props.theme.emojiPickerShadow || "rgba(0,0,0,0.3)"} !important;
        border: 1px solid ${(props) => props.theme.border} !important;
        border-radius: 1.2rem !important;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: ${(props) => props.theme.emojiPickerBg};
          width: 5px;
          &-thumb {
            background-color: ${(props) => props.theme.primary};
            border-radius: 10px;
          }
        }

        .emoji-categories {
          button {
            filter: contrast(0) brightness(${(props) => (props.theme.name === "Solar Aurora" ? 0.3 : 1.5)});
          }
        }

        .emoji-search {
          background-color: ${(props) => props.theme.inputBg} !important;
          border: 1px solid ${(props) => props.theme.glassBorder} !important;
          color: ${(props) => props.theme.textPrimary} !important;
          border-radius: 0.6rem !important;
        }

        .emoji-group:before {
          background-color: ${(props) => props.theme.emojiPickerBg} !important;
          color: ${(props) => props.theme.textSecondary} !important;
          font-size: 0.95rem;
          font-weight: 700;
        }
      }
    }
  }

  .input-container {
    flex: 1;
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background-color: ${(props) => props.theme.inputBg};
    border: 1px solid ${(props) => props.theme.glassBorder};
    padding: 0.4rem 0.5rem 0.4rem 1.2rem;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: ${(props) => props.theme.primary};
      box-shadow: 0 0 12px ${(props) => props.theme.primary}33;
      background-color: transparent;
    }

    input {
      width: 90%;
      height: 2.2rem;
      background-color: transparent;
      color: ${(props) => props.theme.textPrimary};
      border: none;
      font-size: 1rem;
      outline: none;

      &::selection {
        background-color: ${(props) => props.theme.primary}66;
      }
      &::placeholder {
        color: ${(props) => props.theme.textSecondary}88;
      }
    }

    button {
      padding: 0.6rem 1.4rem;
      border-radius: 0.9rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, ${(props) => props.theme.primary} 0%, ${(props) => props.theme.secondary} 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 10px ${(props) => props.theme.primary}44;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      &:hover {
        transform: scale(1.05) translateY(-1px);
        box-shadow: 0 6px 15px ${(props) => props.theme.primary}77;
        filter: brightness(1.1);
      }

      &:active {
        transform: scale(0.98) translateY(0);
      }

      svg {
        font-size: 1.3rem;
        color: ${(props) => props.theme.buttonText};
      }
    }
  }

  @keyframes pickerFade {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;
