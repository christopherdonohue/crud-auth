import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import {
   Form,
   FormContainer,
   StyleWrapper,
   SubmitButton,
} from './StyledComponents/formStyles';

const Register = () => {
   const theme = {
      main: '#738ADB',
   };

   //let allFieldsInFormFilled = useRef(false);
   const [allFieldsInFormFilled, setAllFieldsInFormFilled] = useState(false);
   const [isRegistered, setIsRegistered] = useState(false);
   const [formData, setFormData] = useState({
      firstName: '',
      username: '',
      password: '',
      confirmPassword: '',
   });

   const handleSubmit = (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
         alert(`Passwords Don't Match!`);
         return;
      }

      axios
         .post('http://localhost:3001/auth/register', {
            firstName: formData.firstName,
            username: formData.username,
            password: formData.password,
         })
         .then((res) => {
            console.log(`Successfully registered ${formData.username}!`);
            setIsRegistered(true);
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

      return () => setAllFieldsInFormFilled(false);
   }, [formData]);

   return (
      <>
         {isRegistered ? (
            <Redirect to='/login' />
         ) : (
            <ThemeProvider theme={theme}>
               <StyleWrapper>
                  <FormContainer>
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
                              pointerEvents={!allFieldsInFormFilled && `none`}
                              opacity={!allFieldsInFormFilled && `0.7`}
                              marginTop={`3em`}
                           >
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

export default Register;
