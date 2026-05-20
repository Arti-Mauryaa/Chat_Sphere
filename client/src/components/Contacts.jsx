import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { FaPalette, FaSearch, FaEdit } from "react-icons/fa";
import { useAppTheme, themes } from "../utils/ThemeContext";
import CurrentUserDrawer from "./CurrentUserDrawer";
import Logout from "./Logout";

export default function Contacts({ contacts, changeChat, currentUser, onProfileUpdate, unreadMessages = {} }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const { theme, setTheme } = useAppTheme();

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
    } else {
      const stored = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      }
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };


  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className="brand">
            <div className="brand-info">
              <img src={Logo} alt="logo" />
              <h3>ChatSphere</h3>
            </div>
            <Logout />
          </div>

          <div className="search-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="contacts">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => {
                // Find original index in full contacts to preserve selected state correctly
                const originalIndex = contacts.findIndex(
                  (c) => c._id === contact._id
                );
                return (
                  <div
                    key={contact._id}
                    className={`contact ${
                      originalIndex === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(originalIndex, contact)}
                  >
                    <div className="avatar">
                      <img
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        alt=""
                      />
                      <span className="online-indicator"></span>
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                      <p className="status-text">tap to chat</p>
                    </div>
                    {unreadMessages[contact._id] > 0 && (
                      <div className="unread-badge">
                        {unreadMessages[contact._id]}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-contacts">
                <p>No contacts found</p>
              </div>
            )}
          </div>

          <div className="current-user">
            <div
              className="user-profile-details"
              onClick={() => setShowSettingsDrawer(true)}
              title="Edit Profile"
            >
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h2>
                  {currentUserName} <FaEdit className="edit-icon" />
                </h2>
                <span>Online</span>
              </div>
            </div>

            <div className="theme-toggle-container">
              <button
                className="theme-menu-btn"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change Theme"
              >
                <FaPalette />
              </button>

              {showThemeMenu && (
                <div className="theme-dropdown">
                  <div className="dropdown-header">Select Theme</div>
                  {Object.keys(themes).map((tKey) => (
                    <div
                      key={tKey}
                      className={`theme-option ${theme === tKey ? "active" : ""}`}
                      onClick={() => {
                        setTheme(tKey);
                        setShowThemeMenu(false);
                      }}
                    >
                      <span
                        className="color-dot"
                        style={{
                          background: themes[tKey].primary,
                        }}
                      ></span>
                      {themes[tKey].name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      )}

      <CurrentUserDrawer
        show={showSettingsDrawer}
        onClose={() => setShowSettingsDrawer(false)}
        onProfileUpdate={onProfileUpdate}
      />

    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 5rem 4.5rem 1fr 5.5rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.sidebarBg};
  border-right: 1px solid ${(props) => props.theme.border};
  transition: all 0.3s ease;
  position: relative;

  @media screen and (max-width: 768px) {
    grid-template-rows: 4rem 4rem 1fr 5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    
    .brand-info {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      
      img {
        height: 2.2rem;
        filter: drop-shadow(0 0 5px ${(props) => props.theme.primary}50);
      }
      h3 {
        color: ${(props) => props.theme.textPrimary};
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 1.2rem;
      }
    }
  }

  .search-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1.2rem;

    .search-bar {
      display: flex;
      align-items: center;
      background: ${(props) => props.theme.inputBg};
      border: 1px solid ${(props) => props.theme.glassBorder};
      border-radius: 0.8rem;
      width: 100%;
      padding: 0.6rem 1rem;
      gap: 0.8rem;
      transition: all 0.3s ease;

      &:focus-within {
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 10px ${(props) => props.theme.primary}33;
      }

      .search-icon {
        color: ${(props) => props.theme.textSecondary};
        font-size: 0.9rem;
      }

      input {
        background: transparent;
        border: none;
        color: ${(props) => props.theme.textPrimary};
        font-size: 0.95rem;
        width: 100%;
        outline: none;

        &::placeholder {
          color: ${(props) => props.theme.textSecondary}aa;
        }
      }
    }
  }

  .contacts {
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 0.5rem 0;
    gap: 0.6rem;
    width: 100%;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.border};
      border-radius: 10px;
    }

    .no-contacts {
      color: ${(props) => props.theme.textSecondary};
      margin-top: 2rem;
      font-size: 0.95rem;
    }

    .contact {
      background-color: transparent;
      border: 1px solid transparent;
      min-height: 4.8rem;
      cursor: pointer;
      width: 90%;
      border-radius: 1rem;
      padding: 0.8rem 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background-color: ${(props) => props.theme.contactHoverBg};
        transform: translateY(-1px);
      }

      .avatar {
        position: relative;
        display: flex;
        align-items: center;
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
        }
        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          height: 0.75rem;
          width: 0.75rem;
          border-radius: 50%;
          background-color: ${(props) => props.theme.onlineDot};
          border: 2px solid ${(props) => props.theme.sidebarBg};
          box-shadow: 0 0 8px ${(props) => props.theme.onlineDot};
        }
      }

      .username {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        flex: 1; /* allow it to fill space so badge stays on right */
        h3 {
          color: ${(props) => props.theme.textPrimary};
          font-size: 1rem;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .status-text {
          color: ${(props) => props.theme.textSecondary};
          font-size: 0.75rem;
          opacity: 0.7;
        }
      }
      
      .unread-badge {
        background: linear-gradient(135deg, ${(props) => props.theme.primary}, ${(props) => props.theme.secondary});
        color: ${(props) => props.theme.buttonText || "#ffffff"};
        font-size: 0.75rem;
        font-weight: 800;
        min-width: 1.5rem;
        height: 1.5rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.4rem;
        box-shadow: 0 0 10px ${(props) => props.theme.primary}66;
        animation: badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }

    @keyframes badgePop {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .selected {
      background-color: ${(props) => props.theme.activeBg} !important;
      border: 1px solid ${(props) => props.theme.border};
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      .username h3 {
        color: ${(props) => props.theme.textPrimary};
        font-weight: 700;
      }
      .username .status-text {
        color: ${(props) => props.theme.primary};
        font-weight: 600;
        opacity: 1;
      }
    }
  }

  .current-user {
    background-color: ${(props) => props.theme.currentUserBg};
    border-top: 1px solid ${(props) => props.theme.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.2rem;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    gap: 0.5rem;
    z-index: 10;

    .user-profile-details {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
      padding: 0.4rem 0.6rem;
      border-radius: 0.8rem;
      transition: all 0.25s ease;

      &:hover {
        background-color: ${(props) => props.theme.contactHoverBg};
        transform: translateY(-1px);
        
        .avatar img {
          border-color: ${(props) => props.theme.secondary};
          box-shadow: 0 0 10px ${(props) => props.theme.primary}66;
        }

        .username h2 .edit-icon {
          color: ${(props) => props.theme.primary};
          opacity: 1;
          transform: scale(1.15);
        }
      }

      .avatar {
        img {
          height: 2.8rem;
          width: 2.8rem;
          border-radius: 50%;
          border: 2px solid ${(props) => props.theme.primary};
          transition: all 0.25s ease;
        }
      }

      .username {
        display: flex;
        flex-direction: column;
        h2 {
          color: ${(props) => props.theme.textPrimary};
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;

          .edit-icon {
            font-size: 0.75rem;
            color: ${(props) => props.theme.textSecondary};
            opacity: 0.5;
            transition: all 0.25s ease;
          }
        }
        span {
          color: ${(props) => props.theme.primary};
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          
          &::before {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: ${(props) => props.theme.onlineDot};
            border-radius: 50%;
            box-shadow: 0 0 5px ${(props) => props.theme.onlineDot};
          }
        }
      }
    }


    .theme-toggle-container {
      position: relative;

      .theme-menu-btn {
        background: ${(props) => props.theme.inputBg};
        color: ${(props) => props.theme.textPrimary};
        border: 1px solid ${(props) => props.theme.glassBorder};
        height: 2.3rem;
        width: 2.3rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: ${(props) => props.theme.primary};
          color: ${(props) => props.theme.buttonText};
          border-color: ${(props) => props.theme.primary};
          transform: rotate(30deg);
        }
      }

      .theme-dropdown {
        position: absolute;
        bottom: 3.2rem;
        right: 0;
        background-color: ${(props) => props.theme.emojiPickerBg};
        border: 1px solid ${(props) => props.theme.border};
        border-radius: 1rem;
        padding: 0.6rem;
        width: 160px;
        box-shadow: 0 10px 25px ${(props) => props.theme.emojiPickerShadow || "rgba(0,0,0,0.3)"};
        z-index: 100;
        animation: slideUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        .dropdown-header {
          font-size: 0.8rem;
          font-weight: 700;
          color: ${(props) => props.theme.textSecondary};
          padding: 0.4rem 0.6rem;
          border-bottom: 1px solid ${(props) => props.theme.border};
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.6rem;
          font-size: 0.85rem;
          color: ${(props) => props.theme.textPrimary};
          border-radius: 0.6rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;

          &:hover {
            background-color: ${(props) => props.theme.contactHoverBg};
          }

          &.active {
            background-color: ${(props) => props.theme.activeBg};
            color: ${(props) => props.theme.primary};
            font-weight: 700;
          }

          .color-dot {
            height: 0.75rem;
            width: 0.75rem;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
          }
        }
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0 0.8rem;
      .user-profile-details {
        gap: 0.4rem;
        .username h2 {
          font-size: 0.8rem;
        }
      }
    }
  }

  @keyframes slideUp {
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
