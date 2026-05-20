import React from "react";
import styled from "styled-components";
import { FaTimes, FaEnvelope, FaUser, FaInfoCircle, FaCalendar } from "react-icons/fa";

export default function ProfileDrawer({ contact, show, onClose }) {
  if (!contact) return null;

  return (
    <DrawerContainer className={show ? "show" : ""}>
      <div className="drawer-header">
        <h3>Contact Info</h3>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="drawer-body">
        <div className="profile-hero">
          <div className="avatar-wrapper">
            <img
              src={`data:image/svg+xml;base64,${contact.avatarImage}`}
              alt={contact.username}
            />
            <span className="online-pulse"></span>
          </div>
          <h2>{contact.username}</h2>
          <p className="status-label">Active Now</p>
        </div>

        <div className="info-list">
          <div className="info-item">
            <div className="info-icon">
              <FaUser />
            </div>
            <div className="info-content">
              <span className="label">Username</span>
              <span className="value">@{contact.username}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <span className="label">Email Address</span>
              <span className="value">{contact.email || `${contact.username}@chatsphere.com`}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaInfoCircle />
            </div>
            <div className="info-content">
              <span className="label">Bio</span>
              <span className="value italic">
                "Hey there! I am loving the gorgeous new glassmorphic themes on ChatSphere. ✨"
              </span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaCalendar />
            </div>
            <div className="info-content">
              <span className="label">Member Since</span>
              <span className="value">May 2026</span>
            </div>
          </div>
        </div>

        <div className="shared-media">
          <h4>Security & Settings</h4>
          <div className="security-notice">
            <p>🔒 Messages in this chat are encrypted and transmitted securely via secure WebSockets.</p>
          </div>
        </div>
      </div>
    </DrawerContainer>
  );
}

const DrawerContainer = styled.div`
  width: 0px;
  opacity: 0;
  height: 100%;
  background: ${(props) => props.theme.sidebarBg};
  border-left: 1px solid ${(props) => props.theme.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;

  &.show {
    width: 320px;
    opacity: 1;

    @media screen and (max-width: 768px) {
      width: 100vw;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid ${(props) => props.theme.border};

    h3 {
      color: ${(props) => props.theme.textPrimary};
      font-weight: 700;
      font-size: 1.1rem;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: ${(props) => props.theme.textSecondary};
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;

      &:hover {
        color: ${(props) => props.theme.primary};
        transform: rotate(90deg);
      }
    }
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.border};
      border-radius: 10px;
    }

    .profile-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.8rem;

      .avatar-wrapper {
        position: relative;
        img {
          height: 6.5rem;
          width: 6.5rem;
          border-radius: 50%;
          border: 3px solid ${(props) => props.theme.primary};
          padding: 0.2rem;
          background: ${(props) => props.theme.inputBg};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .online-pulse {
          position: absolute;
          bottom: 5px;
          right: 5px;
          height: 1rem;
          width: 1rem;
          background-color: ${(props) => props.theme.onlineDot};
          border: 3px solid ${(props) => props.theme.sidebarBg};
          border-radius: 50%;
          box-shadow: 0 0 10px ${(props) => props.theme.onlineDot};
        }
      }

      h2 {
        color: ${(props) => props.theme.textPrimary};
        font-size: 1.4rem;
        font-weight: 700;
      }

      .status-label {
        font-size: 0.8rem;
        color: ${(props) => props.theme.primary};
        font-weight: 600;
        background-color: ${(props) => props.theme.activeBg};
        padding: 0.2rem 0.8rem;
        border-radius: 1rem;
      }
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;

      .info-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 0.8rem;
        background-color: ${(props) => props.theme.contactHoverBg};
        border: 1px solid ${(props) => props.theme.glassBorder};
        border-radius: 0.8rem;

        .info-icon {
          color: ${(props) => props.theme.primary};
          font-size: 1rem;
          margin-top: 0.2rem;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;

          .label {
            font-size: 0.75rem;
            color: ${(props) => props.theme.textSecondary};
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .value {
            font-size: 0.9rem;
            color: ${(props) => props.theme.textPrimary};
            word-break: break-word;

            &.italic {
              font-style: italic;
              opacity: 0.9;
            }
          }
        }
      }
    }

    .shared-media {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      h4 {
        color: ${(props) => props.theme.textPrimary};
        font-size: 0.9rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .security-notice {
        background-color: ${(props) => props.theme.inputBg};
        border: 1px dashed ${(props) => props.theme.border};
        border-radius: 0.8rem;
        padding: 0.8rem;
        font-size: 0.8rem;
        color: ${(props) => props.theme.textSecondary};
        line-height: 1.4;
      }
    }
  }
`;
