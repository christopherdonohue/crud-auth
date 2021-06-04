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
   width: 50%;
   height: 2.3em;
   border-radius: 3px;
   border: none;
   background: #4e5d94;
   color: white;
   margin-top: ${({ marginTop }) => `${marginTop}`};
   pointer-events: ${({ pointerEvents }) => `${pointerEvents}`};
   opacity: ${({ opacity }) => `${opacity}`};

   :hover {
      cursor: pointer;
   }
   :active {
      background: #99aab5;
   }
`;

export const StyleWrapper = styled.div`
   display: flex;
   flex-flow: column nowrap;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 95vh;
   background: ${({ theme }) => theme.main};
`;

export const FormContainer = styled.div`
   display: flex;
   flex-flow: column nowrap;
   justify-content: flex-start;
   align-items: center;
   background: #2c2f33;
   box-shadow: 3px 3px 2px 1px #23272a;
   text-align: center;
   width: 350px;
   height: 400px;
`;
