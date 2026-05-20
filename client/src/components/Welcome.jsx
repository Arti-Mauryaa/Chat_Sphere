import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome({ currentUser }) {
  const userName = currentUser ? currentUser.username : "Guest";

  return (
    <Container>
      <img src={Robot} alt="Robot Welcome" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a contact from the left sidebar to start messaging.</h3>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.textPrimary};
  flex-direction: column;
  text-align: center;
  padding: 2rem;
  transition: all 0.3s ease;

  img {
    height: 18rem;
    filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2));
    margin-bottom: 1.5rem;
    max-width: 100%;
    object-fit: contain;
  }

  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;

    span {
      color: ${(props) => props.theme.primary};
      background: linear-gradient(135deg, ${(props) => props.theme.primary} 0%, ${(props) => props.theme.secondary} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.9;
    max-width: 480px;
    line-height: 1.5;
  }

  @media screen and (max-width: 768px) {
    img {
      height: 12rem;
    }
    h1 {
      font-size: 1.7rem;
    }
    h3 {
      font-size: 0.95rem;
    }
  }
`;