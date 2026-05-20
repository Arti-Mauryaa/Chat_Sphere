import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { updateProfileRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";

export default function CurrentUserDrawer({ show, onClose, onProfileUpdate }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined); // undefined means using existing one
  const [isLoading, setIsLoading] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // ✅ Get current user on load
  useEffect(() => {
    const stored = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      setUsername(user.username);
      setEmail(user.email || "");
    }
  }, [show]);

  // ✅ Helper to generate new random avatars
  const generateRandomName = () => Math.random().toString(36).substring(2, 10);

  const generateAvatarsList = () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const randomName = generateRandomName();
      const svgCode = multiavatar(randomName);
      const encoded = btoa(unescape(encodeURIComponent(svgCode)));
      data.push(encoded);
    }
    setAvatars(data);
    setSelectedAvatar(undefined); // Reset selection
  };

  // ✅ Generate avatars list when drawer opens
  useEffect(() => {
    if (show) {
      generateAvatarsList();
    }
  }, [show]);

  if (!currentUser) return null;

  // ✅ Update selection state on avatar click (replaces auto-save)
  const handleAvatarClick = (index) => {
    setSelectedAvatar(index);
  };

  const hasChanges =
    username !== currentUser.username ||
    email !== (currentUser.email || "") ||
    password.trim() !== "" ||
    selectedAvatar !== undefined;

  // ✅ Handle single button save for all changed fields
  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty", toastOptions);
      return;
    }
    if (!email.trim()) {
      toast.error("Email cannot be empty", toastOptions);
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {};
      if (username !== currentUser.username) updateData.username = username.trim();
      if (email !== (currentUser.email || "")) updateData.email = email.trim();
      if (password.trim()) {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters.", toastOptions);
          setIsLoading(false);
          return;
        }
        updateData.password = password;
      }
      if (selectedAvatar !== undefined) {
        updateData.avatarImage = avatars[selectedAvatar];
      }

      const { data } = await axios.post(`${updateProfileRoute}/${currentUser._id}`, updateData);

      if (!data.status) {
        toast.error(data.msg, toastOptions);
      } else {
        toast.success("Profile updated successfully! ✨", toastOptions);
        
        // Save new user profile locally
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        // Update state in parent
        onProfileUpdate(data.user);
        
        // Reset password and selection fields
        setPassword("");
        setSelectedAvatar(undefined);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Overlay className={show ? "show" : ""} onClick={onClose} />
      <DrawerContainer className={show ? "show" : ""}>
        <div className="drawer-header">
          <h3>Edit Profile</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSave} className="drawer-form">
          <div className="drawer-body">
            {/* Avatar Section */}
            <div className="avatar-section">
              <h4>Profile Photo</h4>
              <div className="avatar-display">
                <div className="current-avatar-preview">
                  <img
                    src={`data:image/svg+xml;base64,${
                      selectedAvatar !== undefined
                        ? avatars[selectedAvatar]
                        : currentUser.avatarImage
                    }`}
                    alt="Avatar Preview"
                  />
                  <span className="badge">Preview</span>
                </div>
              </div>

              <div className="avatar-picker-title">
                <span>Select a profile photo choice:</span>
                <button
                  type="button"
                  className="refresh-btn"
                  onClick={generateAvatarsList}
                  title="Generate new avatar choices"
                >
                  <FaSyncAlt /> Refresh Choices
                </button>
              </div>

              <div className="avatars-choices">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`avatar-choice ${selectedAvatar === index ? "selected" : ""}`}
                    onClick={() => handleAvatarClick(index)}
                  >
                    <img src={`data:image/svg+xml;base64,${avatar}`} alt={`Option ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider" />

            {/* Form Fields */}
            <div className="form-fields">
              <div className="input-group">
                <label>
                  <FaUser className="icon" /> Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  <FaEnvelope className="icon" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter new email"
                  required
                />
              </div>

              <div className="input-group password-group">
                <label>
                  <FaLock className="icon" /> Change Password
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <small className="help-text">Leave blank to keep your current password.</small>
              </div>
            </div>

            {/* Unified Save Button - appears inside drawer-body below all sections */}
            {hasChanges && (
              <SectionUpdateButton type="submit" disabled={isLoading}>
                {isLoading ? "Saving Changes..." : "Update Profile"}
              </SectionUpdateButton>
            )}
          </div>

          {/* Sticky drawer footer */}
          <div className="drawer-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Close Settings
            </button>
          </div>
        </form>
      </DrawerContainer>
    </>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;

  &.show {
    opacity: 1;
    pointer-events: auto;
  }
`;

const SectionUpdateButton = styled.button`
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.buttonText || "#ffffff"};
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 4px 10px ${(props) => props.theme.primary}30;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInButton 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    opacity: 0.95;
    box-shadow: 0 6px 15px ${(props) => props.theme.primary}50;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes fadeInButton {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  left: -380px;
  width: 380px;
  height: 100vh;
  background: ${(props) => props.theme.sidebarBg};
  border-right: 1px solid ${(props) => props.theme.border};
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.show {
    left: 0;
  }

  @media screen and (max-width: 500px) {
    width: 100vw;
    left: -100vw;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    height: 5rem;
    border-bottom: 1px solid ${(props) => props.theme.border};

    h3 {
      color: ${(props) => props.theme.textPrimary};
      font-weight: 700;
      font-size: 1.2rem;
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: ${(props) => props.theme.textSecondary};
      font-size: 1.2rem;
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

  .drawer-form {
    display: flex;
    flex-direction: column;
    height: calc(100% - 5rem);
    overflow: hidden;
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.border};
      border-radius: 10px;
    }

    .divider {
      border: 0;
      border-top: 1px solid ${(props) => props.theme.border};
      margin: 0.5rem 0;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      h4 {
        color: ${(props) => props.theme.textPrimary};
        font-size: 0.95rem;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.8;
      }

      .avatar-display {
        display: flex;
        justify-content: center;
        margin: 0.5rem 0;

        .current-avatar-preview {
          position: relative;
          display: inline-block;

          img {
            height: 6rem;
            width: 6rem;
            border-radius: 50%;
            border: 3px solid ${(props) => props.theme.primary};
            background: ${(props) => props.theme.inputBg};
            padding: 0.15rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .badge {
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            background: ${(props) => props.theme.primary};
            color: ${(props) => props.theme.buttonText || "#ffffff"};
            font-size: 0.65rem;
            font-weight: 700;
            padding: 0.1rem 0.5rem;
            border-radius: 10px;
            text-transform: uppercase;
          }
        }
      }

      .avatar-picker-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        color: ${(props) => props.theme.textSecondary};

        .refresh-btn {
          background: transparent;
          border: none;
          color: ${(props) => props.theme.primary};
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
          transition: opacity 0.2s;

          &:hover {
            opacity: 0.8;
          }

          svg {
            font-size: 0.75rem;
          }
        }
      }

      .avatars-choices {
        display: flex;
        gap: 0.8rem;
        justify-content: space-between;

        .avatar-choice {
          flex: 1;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid transparent;
          padding: 0.15rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: ${(props) => props.theme.inputBg};
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
          }

          &:hover {
            transform: scale(1.1);
            border-color: ${(props) => props.theme.primary}80;
          }

          &.selected {
            border-color: ${(props) => props.theme.primary};
            box-shadow: 0 0 10px ${(props) => props.theme.primary};
            transform: scale(1.1);
          }
        }
      }
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          color: ${(props) => props.theme.textSecondary};
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        input {
          background-color: ${(props) => props.theme.inputBg};
          border: 1px solid ${(props) => props.theme.border};
          border-radius: 0.5rem;
          color: ${(props) => props.theme.textPrimary};
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;

          &:focus {
            border-color: ${(props) => props.theme.primary};
            background-color: transparent;
            box-shadow: 0 0 5px ${(props) => props.theme.primary}40;
          }
        }

        .password-wrapper {
          position: relative;
          display: flex;
          width: 100%;

          input {
            width: 100%;
            padding-right: 2.5rem;
          }

          .eye-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: ${(props) => props.theme.textSecondary};
            cursor: pointer;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.2rem;

            &:hover {
              color: ${(props) => props.theme.primary};
            }
          }
        }

        .help-text {
          font-size: 0.75rem;
          color: ${(props) => props.theme.textSecondary};
          opacity: 0.7;
        }
      }
    }
  }

  .drawer-footer {
    display: flex;
    gap: 1rem;
    padding: 1.2rem 1.5rem;
    border-top: 1px solid ${(props) => props.theme.border};
    background: ${(props) => props.theme.currentUserBg};
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.15);
    z-index: 10;

    button {
      flex: 1;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.9rem;
    }

    .cancel-btn {
      background: transparent;
      color: ${(props) => props.theme.textSecondary};
      border: 1px solid ${(props) => props.theme.border};

      &:hover:not(:disabled) {
        background: ${(props) => props.theme.contactHoverBg};
        color: ${(props) => props.theme.textPrimary};
      }
    }
  }
`;
