import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { useState, useRef, useEffect, useContext } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import {
  Form,
  FormContainer,
  StyleWrapper,
  SubmitButton,
} from "./StyledComponents/formStyles";
import { gamersContext } from "./Contexts/GamersContext";

const Register = () => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
  const { setNewUserRegistered, newUserRegistered } = useContext(gamersContext);

  //let allFieldsInFormFilled = useRef(false);
  const [allFieldsInFormFilled, setAllFieldsInFormFilled] = useState(false);
  const [toastNotification, setToastNotification] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(`Passwords Don't Match!`);
      return;
    }

    axios
      .post("http://localhost:3001/auth/register", {
        firstName: formData.firstName,
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        console.log(`Successfully registered ${formData.username}!`);
        setNewUserRegistered(true);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });

    // if (
    //   e.target.name === `password` &&
    //   !passwordPattern.test(e.target.value.trim())
    // ) {
    //   setToastNotification({
    //     message: `Password Must Contain 1 Uppercase, 1 Lowercase, and 1 Special Character.`,
    //     type: `Error`,
    //     color: `darkred`,
    //     background: `rgba(255,0,0,0.2)`,
    //   });
    // } else if (
    //   (e.target.name === `confirmPassword` || e.target.name === `password`) &&
    //   e.target.value.trim() !== formData.password
    // ) {
    //   setToastNotification({
    //     ...toastNotification,
    //     message: `Passwords Don't Match.`,
    //     type: `Error`,
    //     color: `darkred`,
    //     background: `rgba(255,0,0,0.2)`,
    //   });
    // } else if (
    //   e.target.name === `confirmPassword` &&
    //   !passwordPattern.test(formData.password)
    // ) {
    //   setToastNotification({
    //     ...toastNotification,
    //     message: `Password Must Contain 1 Uppercase, 1 Lowercase, and 1 Special Character.`,
    //   });
    // } else {
    //   setToastNotification({});
    // }
  };

  useEffect(() => {
    if (
      formData.firstName !== "" &&
      formData.username !== "" &&
      formData.password !== "" &&
      formData.confirmPassword !== ""
    ) {
      console.log(formData);
      setAllFieldsInFormFilled(true);
    }
    if (formData.password || formData.confirmPassword) {
      if (!passwordPattern.test(formData.password)) {
        setToastNotification({
          message: `Password Must Contain 1 Uppercase, 1 Lowercase, and 1 Special Character.`,
          type: `Error`,
          color: `rgba(80,0,0)`,
          background: `rgba(255,0,0,0.55)`,
        });
      } else if (formData.password !== formData.confirmPassword) {
        setToastNotification({
          message: `Passwords Don't Match`,
          type: `Error`,
          color: `rgba(80,0,0)`,
          background: `rgba(255,0,0,0.55)`,
        });
      } else {
        setToastNotification({});
      }
    }

    return () => setAllFieldsInFormFilled(false);
  }, [formData]);

  return (
    <>
      {newUserRegistered ? (
        <Redirect to="/login" />
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
              <h3>Register</h3>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  onChange={handleChange}
                />
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
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={handleChange}
                />
                <SubmitButton
                  type="submit"
                  pointerEvents={
                    (!allFieldsInFormFilled ||
                      (toastNotification.type &&
                        toastNotification.type === `Error`)) &&
                    `none`
                  }
                  opacity={
                    (!allFieldsInFormFilled ||
                      (toastNotification.type &&
                        toastNotification.type === `Error`)) &&
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
      )}
    </>
  );
};

export default Register;

const Toast = styled.div`
  position: absolute;
  width: 200px;
  top: 0;
  transform: translateY(-110%);
  border: 2px solid ${({ color }) => `${color}`};
  background: ${({ background }) => `${background}`};
  color: ${({ color }) => `${color}`};
  text-align: center;
  font-weight: bold;
  font-size: 13px;
`;
