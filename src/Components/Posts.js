import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { gamersContext } from "./Contexts/GamersContext";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";

const Posts = () => {
  const { gamers, setGamers, newUserRegistered, setNewUserRegistered } =
    useContext(gamersContext);
  const [posts, setPosts] = useState();

  useEffect(() => {
    let postsArray = [];
    if (gamers) {
      console.log("yooooo");
      gamers.map((gamer) => {
        const { posts } = gamer;
        return posts.map((post) => {
          postsArray.push(post);
        });
      });
      setPosts(postsArray);
    }
    return () => setNewUserRegistered(false);
  }, [newUserRegistered, gamers]);

  return (
    <Container>
      {posts &&
        posts.map((post) => {
          return (
            <div>
              <Card>{post}</Card>
            </div>
          );
        })}
    </Container>
  );
};

export default Posts;

const Card = styled.div`
  margin: 1em;
  padding: 4px;
  background: #2c2f33;
  max-width: 300px;
  min-height: 150px;
  text-align: center;
  color: #99aab5;
  box-shadow: 5px 5px 4px 1px #23272a;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  height: 95vh;
  background: ${({ theme }) => theme.main};
`;
