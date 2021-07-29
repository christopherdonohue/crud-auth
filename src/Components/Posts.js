import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { gamersContext } from './Contexts/GamersContext';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';

const Posts = () => {
  const { gamers, setGamers, updateListofGamers, setUpdateListofGamers } =
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
    return () => setUpdateListofGamers(false);
  }, [updateListofGamers, gamers]);

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
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  margin: 1em;
  padding: 7px;
  background: #2c2f33;
  width: 8em;
  min-width: 300px;
  height: 9em;
  min-height: 250px;
  text-align: center;
  color: #99aab5;
  box-shadow: 4px 3px 4px 1px rgba(18, 0, 12, 0.7);
  border-radius: 3px;
  word-wrap: break-word;
  overflow-y: auto;
  white-space: pre-wrap;

  h5 {
    position: absolute;
    bottom: 0;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
  min-width: 95vw;
  min-height: 95vh;
  background: linear-gradient(
    to bottom right,
    #4e5d94,
    ${({ theme }) => theme.main} 70%
  ); ;
`;
