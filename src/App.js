import { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router";
import Boys from "./Components/Boys";
import styled from "styled-components";
import axios from "axios";
import { gamersContext } from "./Components/Contexts/GamersContext";
import { Toast } from "./Components/StyledComponents/toastNotificationStyles";
require("dotenv").config();

function App() {
  const { setUpdateListofGamers, toastNotification, setToastNotification } =
    useContext(gamersContext);
  const [textArea, setTextArea] = useState("");
  const [userAuthorized, setUserAuthorized] = useState(true);

  const submitText = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/auth/create",
        { data: textArea, datePosted: Date.now() },
        {
          headers: {
            authorization: `token: ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setUpdateListofGamers(true);
        console.log(res.status);
        return res;
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setUserAuthorized(false);
        }
        return err;
      });
  };

  return (
    <>
      {!userAuthorized && <Redirect to="/login" />}
      <StyleWrapper>
        <Title>
          <img
            className="discordLogo"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.podfeet.com%2Fblog%2Fwp-content%2Fuploads%2F2018%2F02%2Fdiscord-logo.png&f=1&nofb=1"
            alt="discord"
          />
          <span>SOCIAL MEDIA ON THE WORLD WIDE WEB</span>
        </Title>
        <Container className="gamerImage">
          {toastNotification.message &&
            (toastNotification.message.includes(`Account Deleted`) ||
              toastNotification.message.includes(`Welcome,`)) && (
              <Toast
                color={toastNotification.color}
                background={toastNotification.background}
                translate={`-83`}
              >
                {<p>{toastNotification.message}</p>}
              </Toast>
            )}
          <Boys />
        </Container>
        {userAuthorized && (
          <Form onSubmit={submitText}>
            <textarea
              name="textArea"
              onChange={(e) => setTextArea(e.target.value)}
            ></textarea>
            <input type="submit" value="Submit" />
          </Form>
        )}
      </StyleWrapper>
    </>
  );
}

export default App;

const StyleWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-width: 95vw;
  min-height: 95vh;
  background: linear-gradient(
    to bottom right,
    #4e5d94,
    ${({ theme }) => theme.main} 70%
  );
`;

const Title = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #2c2f33;
  font-family: "Bungee Shade", cursive;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  flex-wrap: wrap;
  padding: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 120px;
  padding: 0.5em;
  background: #2c2f33;
  border-radius: 3px;
  box-shadow: 3px 5px 4px 1px #23272a;

  textarea {
    width: 90%;
    height: 50%;
    background: #99aab5;
    outline: none;
    border: 2px solid #99aab5;
    border-radius: 1px;
    text-decoration: none;
    transition: border 200ms;
    :focus {
      border: 2px solid #ef99f7;
    }
  }

  input {
    padding: 4px;
    width: 95%;
    margin-top: 1em;
    background: none;
    color: ${({ theme }) => theme.main};
    font-weight: bolder;
    border: 2px solid ${({ theme }) => theme.main};
    outline: none;
    text-decoration: none;
    border-radius: 2px;
    cursor: pointer;
    transition: background 200ms, color 200ms;

    :hover {
      background: ${({ theme }) => theme.main};
      color: white;
    }
  }
`;
