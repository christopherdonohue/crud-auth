import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import {
   Form,
   FormContainer,
   StyleWrapper,
   SubmitButton,
} from './StyledComponents/formStyles';

const Login = () => {
   const theme = {
      main: '#738ADB',
   };

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
            username: formData.username,
            password: formData.password,
         })
         .then((res) => {
            console.log(
               `User ${formData.username} Successfully Authenticated!`
            );
            setUserIsAuthenticated(true);
            return res.data;
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <>
         {userIsAuthenticated ? (
            <Redirect to='/' />
         ) : (
            <ThemeProvider theme={theme}>
               <StyleWrapper>
                  <FormContainer>
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
            </ThemeProvider>
         )}
      </>
   );
};

export default Login;
