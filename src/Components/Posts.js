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
  const [userId, setUserId] = useState();
  const [editPost, setEditPost] = useState({ bool: false });
  const [booleansArray, setBooleansArray] = useState();
  const [editedPost, setEditedPost] = useState();
  const [postIndexUniqueToLoggedInUser, setPostIndexUniqueToLoggedInUser] =
    useState();

  useEffect(() => {
    axios
      .post(
        `http://localhost:3001/gamers/findOne`,
        {},
        {
          headers: {
            authorization: `token: ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setUserId(res.data.gamer._id);
        return res;
      })
      .catch((err) => {
        return err;
      });
  }, []);

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
            userId: post.userId,
          });
        });
      });
      setPosts(postsArray);
    }
    return () => setUpdateListofGamers(false);
  }, [updateListofGamers, gamers]);

  useEffect(() => {
    let count = [];
    if (posts) {
      posts.forEach((post) => {
        count.push(false);
      });
      setBooleansArray(count);
    }
  }, [posts]);

  useEffect(() => {
    let temp;
    if (editPost.bool) {
      gamers.forEach((gamer) => {
        if (gamer._id === userId) {
          gamer.posts.map((post, index) => {
            if (post.postBody === editPost.post) {
              temp = index;
            }
          });
        }
      });
    }
    setPostIndexUniqueToLoggedInUser(temp);
  }, [editPost]);

  const handleEditPost = (index, post) => {
    let temp = [...booleansArray];
    temp[index] = !temp[index];
    setBooleansArray(temp);
    setEditPost({ bool: !editPost.bool, post: post });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setEditedPost(e.target.value);
  };

  const handleSubmitEditedPost = (index) => {
    console.log(index);
    axios
      .patch(`http://localhost:3001/gamers/${userId}`, {
        index: index,
        newPost: editedPost,
      })
      .then((res) => {
        console.log(res.data);
        return res;
      })
      .catch((err) => err);
  };

  return (
    <Container>
      {posts &&
        posts.map((post, index) => {
          return (
            <div>
              <Card>
                {post.userId && userId === post.userId && (
                  <div>
                    <button
                      onClick={() => handleEditPost(index, `${post.post}`)}
                    >
                      Edit
                    </button>
                    <button>Delete</button>
                  </div>
                )}
                <h2>{post.username}</h2>
                {booleansArray && !booleansArray[index] && <p>{post.post}</p>}
                {editPost.bool && userId === post.userId && (
                  <ContainerToEditPost>
                    <Textarea onChange={handleChange}>{post.post}</Textarea>
                    <button
                      onClick={() =>
                        handleSubmitEditedPost(postIndexUniqueToLoggedInUser)
                      }
                    >
                      Submit
                    </button>
                  </ContainerToEditPost>
                )}
                <h5>{post.datePosted}</h5>
              </Card>
            </div>
          );
        })}
    </Container>
  );
};

export default Posts;

const ContainerToEditPost = styled.div`
  position: absolute;
  width: 90%;
  height: 45%;
  bottom: 0;
  transform: translateY(-55%);
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 80%;
  border: 2px solid gray;
  background-color: transparent;
  color: white;
`;

const Card = styled.div`
  position: relative;
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
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;
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
