import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { gamersContext } from './Contexts/GamersContext';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';

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
            postId: post.postId,
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

  const handleEditPost = (index, post) => {
    let temp = [...booleansArray];
    console.log(temp);
    temp[index] = !temp[index];
    setBooleansArray(temp);
    setEditPost({ bool: !editPost.bool, post: post });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setEditedPost(e.target.value);
  };

  const handleSubmitEditedPost = (postId) => {
    console.log(postId);
    axios
      .patch(`http://localhost:3001/gamers/${userId}`, {
        postId: postId,
        newPost: editedPost,
      })
      .then((res) => {
        console.log(res.data);
        setUpdateListofGamers(true);
        return res;
      })
      .catch((err) => err);
  };

  const handleDeletePost = (postId) => {
    axios
      .patch(`http://localhost:3001/gamers/deletePost/${userId}`, {
        postId: postId,
      })
      .then((res) => {
        setUpdateListofGamers(true);
        return res;
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <Container>
      {posts &&
        posts.map((post, index) => {
          return (
            <div>
              <Card>
                {post.userId && userId === post.userId && (
                  <IconsContainer>
                    <BiEdit
                      cursor={'pointer'}
                      size={'1.25rem'}
                      fill={'rgba(0,255,0,0.5)'}
                      onClick={() => handleEditPost(index, post.post)}
                    />
                    <MdDelete
                      cursor={'pointer'}
                      size={'1.25rem'}
                      fill={'rgba(255,0,0,0.7'}
                      onClick={() => handleDeletePost(post.postId)}
                    />
                  </IconsContainer>
                )}
                <h2>{post.username}</h2>
                {booleansArray && !booleansArray[index] && (
                  <PostContainer>
                    <div>{post.post}</div>
                  </PostContainer>
                )}
                {userId === post.userId &&
                  booleansArray &&
                  booleansArray[index] && (
                    <ContainerToEditPost>
                      <Textarea
                        onChange={handleChange}
                        defaultValue={post.post}
                      />
                      <SaveButton
                        onClick={() => handleSubmitEditedPost(post.postId)}
                      >
                        Save
                      </SaveButton>
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

const PostContainer = styled.div`
  padding: 0.5rem 0.75rem;
`;

const SaveButton = styled.button`
  width: 98%;
  border: 2px solid green;
  border-radius: 2px;
  background-color: green;
  color: white;
  margin-top: 0.25em;
  font-weight: bold;

  :hover {
    box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 6px -2px;
    cursor: pointer;
  }
`;

const IconsContainer = styled.div`
  position: absolute;
  top: 0.1em;
  right: 0.1em;
  display: flex;
  gap: 0.2em;
`;

const ContainerToEditPost = styled.div`
  width: 95%;
  height: 25%;
`;

const Textarea = styled.textarea`
  width: 95%;
  height: 80%;
  border: 2px solid gray;
  background-color: transparent;
  color: white;
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  margin: 1em;
  padding: 0.5em;
  background: #2c2f33;
  width: 8em;
  min-width: 300px;
  min-height: 15em;
  text-align: center;
  color: #99aab5;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;
  border-radius: 3px;
  word-wrap: break-word;
  overflow-y: auto;
  white-space: pre-wrap;

  h5 {
    /* position: absolute;
    bottom: 0;
    transform: translateY(40%); */
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
