import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
   const theme = {
      main: '#738ADB',
   };

   const [formData, setFormData] = useState({ username: '', password: '' });

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value.trim(),
      });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      axios
         .post('http://localhost:3000/auth/login/', {
            username: formData.username,
            password: formData.password,
         })
         .then((res) => {
            console.log('User Successfully Authorized.');
            return res.data;
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <ThemeProvider theme={theme}>
         <StyleWrapper>
            <LoginContainer>
               <LoginForm onSubmit={handleSubmit}>
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
                     <button type='submit'>Submit</button>
                  </div>
               </LoginForm>
            </LoginContainer>
         </StyleWrapper>
      </ThemeProvider>
   );
};

export default Login;

const LoginForm = styled.form`
   color: #99aab5;

   position: absolute;
   height: 90%;
   width: 95%;
   margin: 1em;

   h3 {
      letter-spacing: 2px;
      font-style: italic;
   }

   .input-container {
      input {
         height: 2em;
         width: 90%;
         margin: 1em;
         background: #99aab5;
         border: none;
         outline: none;

         ::placeholder {
            color: #5a585e;
         }
      }

      button {
         width: 50%;
         height: 2em;
         border-radius: 3px;
         border: none;
         background: #4e5d94;
         color: white;
         margin-top: 8em;

         :hover {
            cursor: pointer;
         }
         :active {
            background: #99aab5;
         }
      }
      height: 80%;
      width: auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
   }
`;

const StyleWrapper = styled.div`
   display: flex;
   flex-flow: column nowrap;
   width: 100%;
   height: 95vh;
   background: ${({ theme }) => theme.main};
`;

const LoginContainer = styled.div`
   display: flex;
   flex-flow: column nowrap;
   justify-content: flex-start;
   align-items: center;
   background: #2c2f33;
   box-shadow: 3px 3px 2px 1px #23272a;
   text-align: center;
   width: 18%;
   height: 40%;
   margin: 10em auto;
   min-width: 200px;
   position: relative;
`;
