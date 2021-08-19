import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import {
  Form,
  FormContainer,
  StyleWrapper,
  SubmitButton,
} from './StyledComponents/formStyles';
import { gamersContext } from './Contexts/GamersContext';
import { Toast } from './StyledComponents/toastNotificationStyles';

const Login = () => {
  const location = useLocation();
  const { setToastNotification, toastNotification } = useContext(gamersContext);

  // const [toastNotification, setToastNotification] = useState(
  //   location.state ? location.state.toast : {}
  // );
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      .post('http://localhost:3001/auth/login', {
        username: { value: formData.username },
        password: formData.password,
      })
      .then((res) => {
        console.log(`User ${formData.username} Successfully Authenticated!`);
        localStorage.setItem('token', res.data.token);
        setUserIsAuthenticated(true);
        setToastNotification({
          message: `Welcome, ${formData.username}!`,
          color: `rgba(21, 104, 73)`,
          background: `rgba(0,255,0,0.5)`,
          type: `Success`,
        });
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

  return (
    <>
      {userIsAuthenticated && <Redirect to='/' />}
      <StyleWrapper>
        <FormContainer>
          {toastNotification.message &&
            !toastNotification.message.includes(`Account Deleted`) &&
            toastNotification.type !== `Registration-Error` && (
              <Toast
                color={toastNotification.color}
                background={toastNotification.background}
              >
                {<p>{toastNotification.message}</p>}
              </Toast>
            )}
          <Form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className='input-container'>
              <input
                type='text'
                placeholder='Username'
                name='username'
                onChange={handleChange}
              />
              <input
                type='password'
                placeholder='Password'
                name='password'
                onChange={handleChange}
              />
              <SubmitButton marginTop={`8em`} type='submit'>
                Submit
              </SubmitButton>
            </div>
          </Form>
        </FormContainer>
      </StyleWrapper>
    </>
  );
};

export default Login;
