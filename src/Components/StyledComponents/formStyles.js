import React from 'react';
import styled from 'styled-components';

export const Form = styled.form`
  color: #99aab5;

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
      outline: #4e5d94 2px solid;
      border: none;
      transition: outline 185ms;
      :focus {
        outline: #ef99f7 2px solid;
      }

      ::placeholder {
        color: #5a585e;
      }
    }

    /* button {
         width: 50%;
         height: 2.3em;
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
      } */
    height: 80%;
    width: auto;
  }
`;

export const SubmitButton = styled.button`
  padding: 4px;
  width: 93%;
  margin-top: 1em;
  background: none;
  color: ${({ theme }) => theme.main};
  font-weight: bolder;
  border: 2px solid ${({ theme }) => theme.main};
  outline: none;
  text-decoration: none;
  border-radius: 2px;
  cursor: ${({ pointerEvents }) =>
    pointerEvents ? `${pointerEvents}` : `pointer`};
  transition: background 200ms, color 200ms;
  margin-top: ${({ marginTop }) => `${marginTop}`};
  opacity: ${({ opacity }) => `${opacity}`};
  pointer-events: ${({ pointerEvents }) => `${pointerEvents}`};

  :hover {
    background: ${({ theme }) => theme.main};
    color: white;
  }
`;

export const StyleWrapper = styled.div`
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
  ); ;
`;

export const FormContainer = styled.div`
  position: relative;
  border-radius: 3px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  background: #2c2f33;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;
  text-align: center;
  width: 350px;
  height: 400px;
`;
