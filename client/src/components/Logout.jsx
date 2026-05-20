import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick} title="Log Out">
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem;
  border-radius: 0.8rem;
  background-color: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    font-size: 1.3rem;
    color: ${(props) => props.theme.textPrimary};
    transition: all 0.3s ease;
  }

  &:hover {
    background-color: #ef4444;
    border-color: #ef4444;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);

    svg {
      color: #ffffff;
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;
