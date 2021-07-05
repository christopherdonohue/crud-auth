import React from "react";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import { useState } from "react";

const GamerProfile = () => {
  const [gamer, setGamer] = useState("default name");
  const { id } = useParams();

  return (
    <>
      {gamer && (
        <StyleWrapper>
          <Container>
            <SingularGamer>
              <h1>{gamer.firstName}</h1>
              <h2>{gamer.username}</h2>
            </SingularGamer>
          </Container>
          <FormContainer>
            <textarea type="text" placeholder="Say something..." />
            <button type="submit">Submit</button>
          </FormContainer>
        </StyleWrapper>
      )}
    </>
  );
};

export default GamerProfile;

const StyleWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background: ${({ theme }) => theme.main};
`;

const Container = styled.div`
  display: flex;
  align-items: baseline;
  padding-top: 8em;
  justify-content: center;
  margin: 0 auto;
  width: 23%;
`;

const SingularGamer = styled.div`
  text-align: center;
  padding: 1em;
  background-color: #2c2f33;
  box-shadow: 6px 6px 4px 1px #23272a;
  color: gray;

  h1,
  h2 {
    color: #99aab5;
  }

  h3 {
    color: ${({ color }) => color};
  }

  img {
    border-radius: 50%;
  }
`;

const FormContainer = styled.form`
  background: #2c2f33;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  margin: 1em auto;
  padding: 0.5em;
  box-shadow: 3px 3px 2px 1px #23272a;

  textarea {
    width: 190px;
    height: 75px;
    background: #99aab5;
  }

  button {
    background: ${({ color }) => color};
    margin-top: 0.5em;
    border: none;
  }
`;
