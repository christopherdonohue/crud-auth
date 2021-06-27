import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>

        <RightSideNavButtons>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <RegisterDiv>
              <Link to="/register">Sign Up</Link>
            </RegisterDiv>
          </li>
        </RightSideNavButtons>
      </ul>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.div`
  position: relative;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #4e5d94;
`;

const RegisterDiv = styled.div`
  width: 6em;
  height: 2.6em;
`;

const RightSideNavButtons = styled.div`
  position: absolute;
  justify-content: flex-end;
  right: 2em;
  height: 3em;
`;
