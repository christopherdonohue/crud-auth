import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useState, useRef, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Form,
  FormContainer,
  StyleWrapper,
  SubmitButton,
} from './StyledComponents/formStyles';
import { Toast } from './StyledComponents/toastNotificationStyles';
import { gamersContext } from './Contexts/GamersContext';
import { fromPairs } from 'lodash';

const Register = () => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
  const {
    setUpdateListofGamers,
    updateListofGamers,
    toastNotification,
    setToastNotification,
  } = useContext(gamersContext);

  //let allFieldsInFormFilled = useRef(false);
  const [allFieldsInFormFilled, setAllFieldsInFormFilled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(`Passwords Don't Match!`);
      return;
    }

    axios
      .post('http://localhost:3001/auth/register', {
        firstName: { value: formData.firstName, color: '#99aab5' },
        username: { value: formData.username, color: '#99aab5' },
        password: formData.password,
        profilePicture:
          'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
      })
      .then((res) => {
        console.log(`Successfully registered ${formData.username}!`);
        setToastNotification({
          message: `Registration Successful, Please Sign in to Continue`,
          color: `rgba(21, 104, 73)`,
          background: `rgba(0,255,0,0.5)`,
          type: `Success`,
        });
        setUpdateListofGamers(true);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  useEffect(() => {
    if (
      formData.firstName !== '' &&
      formData.username !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== ''
    ) {
      console.log(formData);
      setAllFieldsInFormFilled(true);
    }
    if (formData.password || formData.confirmPassword) {
      if (!passwordPattern.test(formData.password)) {
        setToastNotification({
          message: `Password Must Contain 1 Uppercase, 1 Lowercase, and 1 Special Character.`,
          type: `Registration-Error`,
          color: `rgba(80,0,0)`,
          background: `rgba(255,0,0,0.55)`,
        });
      } else if (formData.password !== formData.confirmPassword) {
        setToastNotification({
          message: `Passwords Don't Match`,
          type: `Registration-Error`,
          color: `rgba(80,0,0)`,
          background: `rgba(255,0,0,0.55)`,
        });
      } else {
        setToastNotification({});
      }
    }
    if (formData.username.length > 30) {
      setToastNotification({
        message: `Username Cannot Exceed 30 Characters`,
        type: `Registration-Error`,
        color: `rgba(80,0,0)`,
        background: `rgba(255,0,0,0.55)`,
      });
    }

    return () => setAllFieldsInFormFilled(false);
  }, [formData]);

  return (
    <>
      {updateListofGamers && <Redirect to='/login' />}
      <StyleWrapper>
        <FormContainer>
          {toastNotification.type === `Registration-Error` && (
            <Toast
              color={toastNotification.color}
              background={toastNotification.background}
            >
              {<p>{toastNotification.message}</p>}
            </Toast>
          )}
          <Form onSubmit={handleSubmit}>
            <h3>Register</h3>
            <div className='input-container'>
              <input
                type='text'
                placeholder='First Name'
                name='firstName'
                onChange={handleChange}
              />
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
              <input
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                onChange={handleChange}
              />
              <SubmitButton
                type='submit'
                pointerEvents={
                  (!allFieldsInFormFilled ||
                    (toastNotification.type &&
                      toastNotification.type === `Registration-Error`)) &&
                  `none`
                }
                opacity={
                  (!allFieldsInFormFilled ||
                    (toastNotification.type &&
                      toastNotification.type === `Registration-Error`)) &&
                  `0.5`
                }
                marginTop={`3em`}
              >
                Submit
              </SubmitButton>
            </div>
          </Form>
        </FormContainer>
      </StyleWrapper>
    </>
  );
};

export default Register;
