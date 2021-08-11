import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { StyleWrapper } from './StyledComponents/formStyles';
import { gamersContext } from './Contexts/GamersContext';
import { Toast } from './StyledComponents/toastNotificationStyles';

const GamerProfile = () => {
  const {
    updateListofGamers,
    setUpdateListofGamers,
    gamers,
    setToastNotification,
    toastNotification,
  } = useContext(gamersContext);
  const location = useLocation();
  const [image, setImage] = useState();
  const [gamer, setGamer] = useState(
    location.state ? location.state.gamer : {}
  );
  const [textArea, setTextArea] = useState('');
  const [showEditName, setShowEditName] = useState(false);
  const [editFirstNameAndUsername, setEditFirstNameAndUsername] = useState();
  const firstNameChecker = useRef(0);
  const usernameChecker = useRef(0);
  const [showImageUploadComponent, setShowImageUploadComponent] =
    useState(false);
  const { id } = useParams();
  let data;
  let files;

  const handleImageChange = (e) => {
    files = e.target.files;
    data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'cookoutlogs');
  };

  const submitImage = (e) => {
    e.preventDefault();
    axios
      .post(`https://api.cloudinary.com/v1_1/dzr5otslt/image/upload`, data)
      .then((res) => {
        setGamer({ ...gamer, profilePicture: res.data.secure_url });
        setImage(true);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const submitText = (e) => {
    e.preventDefault();
    axios
      .post(
        'http://localhost:3001/auth/description',
        { data: textArea, datePosted: Date.now() },
        {
          headers: {
            authorization: `token: ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        setGamer({ ...gamer, description: textArea });

        return res;
      })
      .catch((err) => {
        if (err.response.status === 403) {
        }
        return err;
      });
  };

  const handleEditFirstAndDisplayName = (e, type) => {
    type === `firstName` && (firstNameChecker.current = e.target.value.length);
    type === `username` && (usernameChecker.current = e.target.value.length);
    if (firstNameChecker.current > 30 || usernameChecker.current > 30) {
      setToastNotification({
        message: `Fields Cannot Exceed 30 Characters`,
        type: `Registration-Error`,
        color: `rgba(80,0,0)`,
        background: `rgba(255,0,0,0.55)`,
      });
    } else {
      setToastNotification({});

      if (type === `firstName`) {
        setEditFirstNameAndUsername({
          ...editFirstNameAndUsername,
          firstName: e.target.value,
        });
      }

      if (type === `username`) {
        setEditFirstNameAndUsername({
          ...editFirstNameAndUsername,
          username: e.target.value,
        });
      }
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:3001/gamers/${gamer._id}`)
      .then((res) => {
        setUpdateListofGamers(true);
        setToastNotification({
          message: `Account Deleted!`,
          color: `rgba(21, 104, 73)`,
          background: `rgba(0,255,0,0.5)`,
          type: `Success`,
        });
        return res;
      })
      .catch((err) => {
        return err;
      });
  };

  const handleEditName = (e) => {
    e.preventDefault();
    if (
      !editFirstNameAndUsername ||
      !editFirstNameAndUsername.firstName ||
      !editFirstNameAndUsername.username
    ) {
      setToastNotification({
        message: `Fields Cannot be Empty`,
        type: `Registration-Error`,
        color: `rgba(80,0,0)`,
        background: `rgba(255,0,0,0.55)`,
      });
    } else {
      const { firstName, username } = editFirstNameAndUsername;
      axios
        .put(`http://localhost:3001/gamers/${gamer._id}`, {
          firstName: firstName,
          username: username,
        })
        .then((res) => {
          console.log(res);
          setGamer({
            ...gamer,
            firstName: firstName,
            username: username,
          });
          setUpdateListofGamers(true);
          setShowEditName(false);
          return res;
        })
        .catch((err) => err);
    }
  };

  useEffect(() => {
    if (image) {
      console.log(`image`);
      axios
        .post(
          'http://localhost:3001/gamers/uploadProfilePicture',
          {
            profilePicture: gamer.profilePicture,
          },
          {
            headers: {
              authorization: `token: ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          console.log(`response from image`);
          setUpdateListofGamers(true);
          return res;
        })
        .catch((err) => {
          return err;
        });
    }
    return () => setImage(false);
  }, [image]);

  useEffect(() => {
    return () => setEditFirstNameAndUsername({});
  }, [showEditName]);

  return (
    <>
      {toastNotification.message &&
        toastNotification.message.includes(`Account Deleted`) && (
          <Redirect to='/' />
        )}
      {gamer && (
        <StyleWrapper1>
          <SingularGamer>
            <FirstBlock>
              <InnerBlock>
                <div className='image-container'>
                  <img
                    onClick={() =>
                      setShowImageUploadComponent(!showImageUploadComponent)
                    }
                    src={gamer.profilePicture}
                    alt='Profile Picture'
                  />
                </div>
                <ChildContainer>
                  {showEditName ? (
                    <InputContainer>
                      {toastNotification && (
                        <Toast
                          color={toastNotification.color}
                          background={toastNotification.background}
                          width={`12.3em`}
                          padding={`0.25rem`}
                        >
                          {toastNotification.message}
                        </Toast>
                      )}
                      <div>
                        <label for='editName'>First Name</label>
                        <input
                          type='text'
                          name='editName'
                          placeholder='Enter New Name...'
                          onChange={(e) =>
                            handleEditFirstAndDisplayName(e, `firstName`)
                          }
                        />
                      </div>
                      <div>
                        <label for='editUserName'>Username</label>
                        <input
                          type='text'
                          name='editUserName'
                          placeholder='Enter New Name...'
                          onChange={(e) =>
                            handleEditFirstAndDisplayName(e, `username`)
                          }
                        />
                      </div>
                      <button
                        style={
                          toastNotification.message && {
                            pointerEvents: 'none',
                            backgroundColor: 'rgba(255,0,0,0.3)',
                            color: 'rgba(255,255,255,0.5',
                          }
                        }
                        onClick={handleEditName}
                      >
                        Save
                      </button>
                    </InputContainer>
                  ) : (
                    <NamesContainer>
                      {gamer.firstName.length > 20 ? (
                        <h3>{gamer.firstName}</h3>
                      ) : gamer.firstName.length > 10 &&
                        gamer.firstName.length < 20 ? (
                        <h2>{gamer.firstName}</h2>
                      ) : (
                        gamer.firstName.length < 10 && (
                          <h1>{gamer.firstName}</h1>
                        )
                      )}
                      {gamer.username.length > 20 ? (
                        <h3>{gamer.username}</h3>
                      ) : gamer.username.length > 10 &&
                        gamer.username.length < 20 ? (
                        <h2>{gamer.username}</h2>
                      ) : (
                        gamer.username.length < 10 && <h1>{gamer.username}</h1>
                      )}
                    </NamesContainer>
                  )}

                  <span onClick={() => setShowEditName(!showEditName)}>
                    edit
                  </span>
                </ChildContainer>
              </InnerBlock>
            </FirstBlock>
            <Description>
              <p>{gamer.description}</p>
            </Description>
            <DeleteDiv>
              <span onClick={handleDeleteAccount}>DELETE ACCOUNT</span>
            </DeleteDiv>
          </SingularGamer>

          {showImageUploadComponent && (
            <ImageUploadForm onSubmit={submitImage}>
              <h4>Change Profile Picture</h4>
              <input
                type='file'
                name='imageFile'
                onChange={handleImageChange}
              />
              <div>
                <input className='upload-button' type='submit' value='Upload' />
              </div>
            </ImageUploadForm>
          )}
          <Form onSubmit={submitText}>
            <textarea
              name='textArea'
              onChange={(e) => setTextArea(e.target.value)}
            ></textarea>
            <input type='submit' value='Submit' />
          </Form>
        </StyleWrapper1>
      )}
    </>
  );
};

export default GamerProfile;

const StyleWrapper1 = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-height: 95vh;
  min-width: 95vw;
  background: linear-gradient(
    to bottom right,
    #4e5d94,
    ${({ theme }) => theme.main} 70%
  ); ;
`;

const ImageUploadForm = styled.form`
  text-align: center;
  position: absolute;
  animation-name: bgAnim;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  transition-timing-function: ease-in-out;
  @keyframes bgAnim {
    from {
      transform: translate(-5%, 70%);
    }
    to {
      transform: translate(-100%, 70%);
    }
  }

  top: 0.5em;
  padding: 0.5em;
  width: 416px;
  border-radius: 3px;
  background: #2c2f33;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;

  h4 {
    color: #99aab5;
  }

  .upload-button {
    margin-top: 1em;
    padding: 4px;
    background: none;
    width: 100%;
    border: 2px solid ${({ theme }) => theme.main};
    color: ${({ theme }) => theme.main};
    border-radius: 2px;
    font-weight: bold;
    cursor: pointer;
    transition: background 200ms, color 200ms;

    :hover {
      background: ${({ theme }) => theme.main};
      color: white;
    }
  }
`;

const Description = styled.div`
  width: 100%;
  height: auto;
  overflow-y: auto;
  /* background-color: #394244; */
  padding: 1em 0 1em 0;
`;

const SingularGamer = styled.div`
  z-index: 1;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  background-color: #2c2f33;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;
  color: gray;
  width: 400px;
  height: 650px;
  border-radius: 3px;

  h1,
  h2 {
    color: #99aab5;
  }

  h3 {
    color: ${({ color }) => color};
  }

  .image-container {
    position: relative;
    width: 12rem;
    height: 12rem;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 2px 3px 4px 1px rgba(18, 0, 12, 0.4);

    :active {
      box-shadow: 3px 4px 5px 2px rgba(18, 0, 12, 0.4);
      opacity: 0.95;
    }
  }

  img {
    position: absolute;
    max-width: 100%;
    width: 100%;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
`;

const FormContainer = styled.form`
  background: #2c2f33;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  margin: 1em auto;
  padding: 0.5em;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;

  textarea {
    width: 190px;
    height: 75px;
    background: #99aab5;
  }

  button {
    background: ${({ color }) => color};
    margin-top: 0.5em;
    border: none;
  }
`;

const Form = styled.form`
  margin-top: 1em;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 120px;
  padding: 0.5em;
  background: #2c2f33;
  border-radius: 3px;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;

  textarea {
    width: 90%;
    height: 50%;
    background: #99aab5;
    outline: none;
    border: 2px solid #99aab5;
    border-radius: 1px;
    text-decoration: none;
    transition: border 200ms;
    :focus {
      border: 2px solid #ef99f7;
    }
  }

  input {
    padding: 4px;
    width: 95%;
    margin-top: 1em;
    background: none;
    color: ${({ theme }) => theme.main};
    font-weight: bolder;
    border: 2px solid ${({ theme }) => theme.main};
    outline: none;
    text-decoration: none;
    border-radius: 2px;
    cursor: pointer;
    transition: background 200ms, color 200ms;

    :hover {
      background: ${({ theme }) => theme.main};
      color: white;
    }
  }
`;

const FirstBlock = styled.div`
  width: 100%;
  border-radius: 3px 3px 0 0;
  background-color: #393c44;
  position: relative;
`;

const ChildContainer = styled.div`
  position: absolute;
  width: 45%;
  height: 100%;
  right: 0.75em;
  span {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -20%);
    position: absolute;
    cursor: pointer;
  }
`;

const InnerBlock = styled.div`
  position: relative;
  width: 98%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem;
`;

const DeleteDiv = styled.div`
  width: 100%;
  background: rgba(255, 0, 0, 0.3);
  position: absolute;
  bottom: 0;
  padding: 0.5em 0 0.5em 0;
  border-radius: 0 0 3px 3px;
  font-weight: bold;
  transition: background 200ms, color 200ms;

  :hover {
    background: rgba(255, 0, 0, 1);
    color: white;
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex-flow: column nowrap;

  position: absolute;
  width: 95%;

  top: 50%;
  transform: translateY(-50%);
  padding-right: 0.5em;
  label {
    display: flex;
    align-self: flex-start;
    font-size: 0.85rem;
  }

  input {
    background-color: rgba(100, 100, 110, 0.5);
    border: 2px solid rgba(0, 0, 25, 0.5);
    border-radius: 2px;
  }

  button {
    border: none;
    background: rgba(255, 0, 0, 0.6);
    color: white;
    width: 40%;
    padding: 0.25em 0.5em;
    font-weight: bold;
    border-radius: 2px;
    /* transition: background 200ms, color 200ms; */
    margin-top: 1em;
    align-self: center;

    :hover {
      background-color: red;
      color: white;
      cursor: pointer;
      box-shadow: rgba(18, 0, 12, 0.8) 0px 4px 4px -2px;
    }
  }
`;

const NamesContainer = styled.div`
  word-break: break-word;
  padding-right: 0.75em;
`;
