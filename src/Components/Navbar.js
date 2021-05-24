import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Navbar = () => {
   return (
      <Nav>
         <ul>
            <li>
               <Link to='/'>Home</Link>
            </li>
            <li>
               <Link to='/about'>About</Link>
            </li>
            <RightSideNavButtons>
               <li>
                  <Link to='/login'>Login</Link>
               </li>
            </RightSideNavButtons>
         </ul>
      </Nav>
   );
};

export default Navbar;

const Nav = styled.nav`
   display: flex;
   align-items: center;
   justify-content: flex-start;
   background-color: #4e5d94;
`;

const RightSideNavButtons = styled.div`
   position: absolute;
   right: 2em;
`;
