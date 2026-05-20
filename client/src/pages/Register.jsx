import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  // ✅ Handle input
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // ✅ Validation
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required.", toastOptions);
      return false;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.", toastOptions);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return false;
    }

    return true;
  };

  // ✅ Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!handleValidation()) return;

    try {
      const { username, email, password } = values;

      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (!data.status) {
        toast.error(data.msg, toastOptions);
        return;
      }

      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong!", toastOptions);
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>ChatSphere</h1>
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button type="submit">Create User</button>

          <span>
            Already have an account?{" "}
            <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>

      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.bgGrad};
  transition: background 0.5s ease;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;

    img {
      height: 4.5rem;
      filter: drop-shadow(0 0 10px ${(props) => props.theme.primary}80);
      animation: float 4s ease-in-out infinite;
    }

    h1 {
      color: ${(props) => props.theme.textPrimary};
      font-weight: 800;
      font-size: 2.2rem;
      letter-spacing: -1px;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: ${(props) => props.theme.cardBg};
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid ${(props) => props.theme.glassBorder};
    border-radius: 2rem;
    padding: 3rem 4rem;
    width: 90%;
    max-width: 480px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    transition: all 0.3s ease;
  }

  .input-group {
    position: relative;
    width: 100%;

    input {
      width: 100%;
      background: ${(props) => props.theme.inputBg};
      padding: 1rem 1.2rem;
      border: 1px solid ${(props) => props.theme.glassBorder};
      border-radius: 0.8rem;
      color: ${(props) => props.theme.textPrimary};
      font-size: 1rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: transparent;
      }

      &:focus {
        border-color: ${(props) => props.theme.primary};
        outline: none;
        background: transparent;
        box-shadow: 0 0 15px ${(props) => props.theme.primary}33;
      }

      &:focus ~ label,
      &:not(:placeholder-shown) ~ label {
        top: -10px;
        left: 10px;
        font-size: 0.8rem;
        background: ${(props) => props.theme.cardBg || props.theme.sidebarBg || "#110e24"};
        padding: 0 0.4rem;
        color: ${(props) => props.theme.primary};
        border-radius: 4px;
      }
    }

    label {
      position: absolute;
      left: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      color: ${(props) => props.theme.textSecondary};
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.3s ease;
    }
  }

  button {
    background: linear-gradient(135deg, ${(props) => props.theme.primary} 0%, ${(props) => props.theme.secondary} 100%);
    color: ${(props) => props.theme.buttonText};
    padding: 1rem;
    border: none;
    font-weight: 700;
    cursor: pointer;
    border-radius: 0.8rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 15px ${(props) => props.theme.primary}50;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    margin-top: 0.5rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${(props) => props.theme.primary}80;
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  span {
    color: ${(props) => props.theme.textSecondary};
    text-align: center;
    font-size: 0.95rem;

    a {
      color: ${(props) => props.theme.primary};
      text-decoration: none;
      font-weight: 700;
      transition: color 0.2s ease;

      &:hover {
        color: ${(props) => props.theme.secondary};
        text-decoration: underline;
      }
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media screen and (max-width: 480px) {
    form {
      padding: 2.5rem 2rem;
      border-radius: 1.5rem;
    }
  }
`;