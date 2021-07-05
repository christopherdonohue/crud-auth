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
      console.log(new Date(Date.now()));
      gamers.map((gamer) => {
        const { posts, username, updatedAt } = gamer;

        return posts.map((post) => {
          let dateString = new Date(post.datePosted);
          let datePosted = `${
            dateString.getMonth() + 1
          }/${dateString.getDate()}/${dateString.getFullYear()}\n${dateString.getHours()}:${dateString.getMinutes()}:${dateString.getSeconds()}`;
          postsArray.push({
            post: post.postBody,
            username: username,
            datePosted: datePosted,
          });
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
              <Card>
                <h2>{post.username}</h2>
                <p>{post.post}</p>
                <h5>{post.datePosted}</h5>
              </Card>
            </div>
          );
        })}
    </Container>
  );
};

export default Posts;

const Card = styled.div`
  margin: 1em;
  padding: 10px;
  background: #2c2f33;
  min-width: 100px;
  max-width: 300px;
  min-height: 150px;
  text-align: center;
  color: #99aab5;
  box-shadow: 5px 5px 4px 1px #23272a;
  border-radius: 3px;
  word-wrap: break-word;
  overflow-y: auto;
  white-space: pre-wrap;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-flow: row wrap;
  min-width: 95vw;
  min-height: 95vh;
  background: linear-gradient(
    to bottom right,
    #4e5d94,
    ${({ theme }) => theme.main} 70%
  ); ;
`;
