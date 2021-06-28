import { useState, useContext } from "react";
import { Redirect } from "react-router";
import Boys from "./Components/Boys";
import styled from "styled-components";
import axios from "axios";
import { gamersContext } from "./Components/Contexts/GamersContext";
require("dotenv").config();

function App() {
  const { setNewUserRegistered } = useContext(gamersContext);
  const [textArea, setTextArea] = useState("");
  const [userAuthorized, setUserAuthorized] = useState(true);

  const submitText = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/auth/create",
        { data: textArea },
        {
          headers: {
            authorization: `token: ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setNewUserRegistered(true);
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
          <Boys />
        </Container>
        <form onSubmit={submitText}>
          <textarea
            name="textArea"
            onChange={(e) => setTextArea(e.target.value)}
          ></textarea>
          <input type="submit" />
        </form>
      </StyleWrapper>
    </>
  );
}

export default App;

const StyleWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 95vh;
  background: ${({ theme }) => theme.main};
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
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  flex-wrap: wrap;
  padding: 10px;
`;
