import React from "react";
import { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import {
  Form,
  FormContainer,
  StyleWrapper,
  SubmitButton,
} from "./StyledComponents/formStyles";

const Login = () => {
  const location = useLocation();

  const [toastNotification, setToastNotification] = useState(
    location.state ? location.state.toast : {}
  );
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/auth/login", {
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        console.log(`User ${formData.username} Successfully Authenticated!`);
        localStorage.setItem("token", res.data.token);
        setUserIsAuthenticated(true);
        return res.data;
      })
      .catch((err) => {
        setToastNotification({
          message: `Incorrect Username or Password`,
          color: `rgba(80,0,0)`,
          background: `rgba(255,0,0,0.55)`,
          type: `Error`,
        });
        console.log(err);
      });
  };

  useEffect(() => {
    if (toastNotification.message) {
      console.log(`timeout login`);
      setTimeout(() => {
        setToastNotification({});
      }, 10000);
    }
  }, [toastNotification]);

  return (
    <>
      {userIsAuthenticated ? (
        <Redirect to="/" />
      ) : (
        <StyleWrapper>
          <FormContainer>
            {toastNotification.message && (
              <Toast
                color={toastNotification.color}
                background={toastNotification.background}
              >
                {<p>{toastNotification.message}</p>}
              </Toast>
            )}
            <Form onSubmit={handleSubmit}>
              <h3>Login</h3>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
                <SubmitButton marginTop={`8em`} type="submit">
                  Submit
                </SubmitButton>
              </div>
            </Form>
          </FormContainer>
        </StyleWrapper>
      )}
    </>
  );
};

export default Login;

const Toast = styled.div`
  position: absolute;
  width: 200px;
  top: 0;
  padding: 4px;
  transform: translateY(-110%);
  border: 2px solid ${({ color }) => `${color}`};
  background: ${({ background }) => `${background}`};
  color: ${({ color }) => `${color}`};
  text-align: center;
  font-weight: bold;
  font-size: 13px;
`;
