import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (!user) navigate("/login");
  }, [navigate]);

  const generateRandomName = () => Math.random().toString(36).substring(2, 10);

  useEffect(() => {
    const generateAvatars = () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const randomName = generateRandomName();
        const svgCode = multiavatar(randomName);
        const encoded = btoa(unescape(encodeURIComponent(svgCode)));
        data.push(encoded);
      }
      setAvatars(data);
      setIsLoading(false);
    };

    generateAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
      image: avatars[selectedAvatar],
    });

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(user)
      );
      navigate("/");
    } else {
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
          <h2 className="loading-text">Generating premium avatars for you...</h2>
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt={`avatar-${index}`}
                />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background: ${(props) => props.theme.bgGrad};
  height: 100vh;
  width: 100vw;
  color: ${(props) => props.theme.textPrimary};
  transition: all 0.3s ease;

  .loader {
    max-inline-size: 100%;
    height: 8rem;
    filter: drop-shadow(0 0 10px ${(props) => props.theme.primary}50);
  }

  .loading-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${(props) => props.theme.textSecondary};
    animation: pulse 1.5s infinite ease-in-out;
  }

  .title-container {
    text-align: center;
    h1 {
      color: ${(props) => props.theme.textPrimary};
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1rem;

    .avatar {
      border: 4px solid transparent;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background-color: ${(props) => props.theme.cardBg};
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      img {
        height: 6rem;
        width: 6rem;
        transition: all 0.3s ease;
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.1) translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        border-color: ${(props) => props.theme.border};
      }
    }

    .selected {
      border: 4px solid ${(props) => props.theme.primary};
      box-shadow: 0 8px 30px ${(props) => props.theme.primary}55 !important;
      transform: scale(1.1);

      img {
        transform: rotate(5deg);
      }
    }
  }

  .submit-btn {
    background: linear-gradient(135deg, ${(props) => props.theme.primary} 0%, ${(props) => props.theme.secondary} 100%);
    color: ${(props) => props.theme.buttonText};
    padding: 1.1rem 2.2rem;
    border: none;
    font-weight: 700;
    cursor: pointer;
    border-radius: 0.8rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 15px ${(props) => props.theme.primary}50;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${(props) => props.theme.primary}80;
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;
