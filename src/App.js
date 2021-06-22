import { useState, useEffect } from 'react';
import Gamers from './Gamers';
import Boys from './Components/Boys';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import axios from 'axios';
var stack = [];

function App() {
   const theme = {
      main: '#738ADB',
   };

   const [gamers, setGamers] = useState([]);
   const [, setHiddenProfiles] = useState([]);

   //let undoButton = gamers.filter((gamer) => gamer.showProfile === false);

   useEffect(() => {
   axios.get(('http://localhost:3001/auth/findAll')).then((res) => {
     console.log(res)
     setGamers(res.data)
      }).then((err) => {
     return err;
  })
   },[])
  
   return (
      <>
         <ThemeProvider theme={theme}>
            <StyleWrapper>
               <Title>
                  <img
                     className='discordLogo'
                     src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.podfeet.com%2Fblog%2Fwp-content%2Fuploads%2F2018%2F02%2Fdiscord-logo.png&f=1&nofb=1'
                     alt='discord'
                  />
                  <span>SOCIAL MEDIA ON THE WORLD WIDE WEB</span>
               </Title>
               {/* {undoButton.length > 0 && (
                  <UndoButton onClick={() => setGamers(stack.pop())}>
                     Undo
                  </UndoButton>
               )} */}
               <Container className='gamerImage'>
                  <Boys
                     gamers={gamers}
                     setGamers={setGamers}
                     setHiddenProfiles={setHiddenProfiles}
                     stack={stack}
                  />
               </Container>
            </StyleWrapper>
         </ThemeProvider>
      </>
   );
}

export default App;

const UndoButton = styled.button`
   font-size: 15px;
   border: none;
   background-color: #99aab5;
   color: #23272a;
   margin: 0 auto;
   text-align: center;
   align-items: center;
   width: 7.5vw;
   height: 3vh;
`;

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
   font-family: 'Bungee Shade', cursive;
`;

const Container = styled.div`
   display: flex;
   justify-content: space-around;
   align-items: baseline;
   flex-wrap: wrap;
   padding: 10px;
`;
