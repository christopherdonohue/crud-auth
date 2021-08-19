import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { Redirect, useLocation, useParams, useHistory } from 'react-router-dom';
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
  const history = useHistory();
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
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [
    showAbilityToChangeProfilePicture,
    setShowAbilityToChangeProfilePicture,
  ] = useState(false);
  const [displayAbilityToChangeTextColor, setDisplayAbilityToChangeTextColor] =
    useState({ bool: false, type: null });
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
          firstName: { value: firstName },
          username: { value: username },
        })
        .then((res) => {
          console.log(res);
          setGamer({
            ...gamer,
            firstName: { value: firstName },
            username: { value: username },
          });
          setUpdateListofGamers(true);
          setShowEditName(false);
          return res;
        })
        .catch((err) => err);
    }
  };

  const handleTextColorChange = (color) => {
    // e.preventDefault();
    console.log(color.hex);
    // setColor(color.hex);
    if (displayAbilityToChangeTextColor.type === 'firstName') {
      setGamer({
        ...gamer,
        firstName: { value: gamer.firstName.value, color: color.hex },
      });
    } else {
      setGamer({
        ...gamer,
        username: { value: gamer.username.value, color: color.hex },
      });
    }
  };

  const handleSaveTextColor = (color) => {
    console.log(`server call`);
    if (displayAbilityToChangeTextColor.type === 'firstName') {
      axios
        .patch(`http://localhost:3001/gamers/${gamer._id}/changeColor`, {
          color: color.hex,
          type: 'firstName',
        })
        .then((res) => {
          setUpdateListofGamers(true);

          return res;
        })
        .catch((err) => err);
    } else {
      axios
        .patch(`http://localhost:3001/gamers/${gamer._id}/changeColor`, {
          color: color.hex,
          type: 'username',
        })
        .then((res) => {
          setUpdateListofGamers(true);
          return res;
        })
        .catch((err) => err);
    }
  };

  // useEffect(() => {
  //   window.history.replaceState({ gamer: gamer }, '');
  // }, [gamer]);

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

  useEffect(() => {
    // On initial render, if they click "edit profile" after freshly logging in, the toast notification may still be visible from before logging in.
    // We want to make sure that toast notification doesn't still diesplay on the profile from logging in.

    if (toastNotification) {
      setToastNotification({});
    }
  }, []);

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
                {!showAbilityToChangeProfilePicture ? (
                  <div className='image-container'>
                    <img
                      // onClick={() =>
                      //   setShowImageUploadComponent(!showImageUploadComponent)
                      // }
                      onMouseEnter={() =>
                        setShowAbilityToChangeProfilePicture(true)
                      }
                      onMouseLeave={() =>
                        setShowAbilityToChangeProfilePicture(false)
                      }
                      src={gamer.profilePicture}
                      alt='Profile Picture'
                    />
                  </div>
                ) : (
                  <div className='image-container'>
                    <img
                      className='change-profile-picture'
                      onClick={() =>
                        setShowImageUploadComponent(!showImageUploadComponent)
                      }
                      onMouseEnter={() =>
                        setShowAbilityToChangeProfilePicture(true)
                      }
                      onMouseLeave={() =>
                        setShowAbilityToChangeProfilePicture(false)
                      }
                      src={gamer.profilePicture}
                      alt='Profile Picture'
                    />
                    <EditProfilePicture
                      onMouseEnter={() =>
                        setShowAbilityToChangeProfilePicture(true)
                      }
                    >
                      Edit Profile Picture
                    </EditProfilePicture>
                  </div>
                )}
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
                      {gamer.firstName.value.length > 20 ? (
                        <H3
                          onDoubleClick={() =>
                            setDisplayAbilityToChangeTextColor({
                              bool: !displayAbilityToChangeTextColor.bool,
                              type: 'firstName',
                            })
                          }
                          color={gamer.firstName.color}
                        >
                          {gamer.firstName.value}
                        </H3>
                      ) : gamer.firstName.value.length > 10 &&
                        gamer.firstName.value.length < 20 ? (
                        <H2
                          onDoubleClick={() =>
                            setDisplayAbilityToChangeTextColor({
                              bool: !displayAbilityToChangeTextColor.bool,
                              type: 'firstName',
                            })
                          }
                          color={gamer.firstName.color}
                        >
                          {gamer.firstName.value}
                        </H2>
                      ) : (
                        gamer.firstName.value.length < 10 && (
                          <H1
                            onDoubleClick={() =>
                              setDisplayAbilityToChangeTextColor({
                                bool: !displayAbilityToChangeTextColor.bool,
                                type: 'firstName',
                              })
                            }
                            color={gamer.firstName.color}
                          >
                            {gamer.firstName.value}
                          </H1>
                        )
                      )}
                      {gamer.username.value.length > 20 ? (
                        <H3
                          onDoubleClick={() =>
                            setDisplayAbilityToChangeTextColor({
                              bool: !displayAbilityToChangeTextColor.bool,
                              type: 'username',
                            })
                          }
                          color={gamer.username.color}
                        >
                          {gamer.username.value}
                        </H3>
                      ) : gamer.username.value.length > 10 &&
                        gamer.username.value.length < 20 ? (
                        <H2
                          onDoubleClick={() =>
                            setDisplayAbilityToChangeTextColor({
                              bool: !displayAbilityToChangeTextColor.bool,
                              type: 'username',
                            })
                          }
                          color={gamer.username.color}
                        >
                          {gamer.username.value}
                        </H2>
                      ) : (
                        gamer.username.value.length < 10 && (
                          <H1
                            onDoubleClick={() =>
                              setDisplayAbilityToChangeTextColor({
                                bool: !displayAbilityToChangeTextColor.bool,
                                type: 'username',
                              })
                            }
                            color={gamer.username.color}
                          >
                            {gamer.username.value}
                          </H1>
                        )
                      )}
                    </NamesContainer>
                  )}
                  {displayAbilityToChangeTextColor.bool && (
                    <TextColorChangerContainer>
                      <SketchPicker
                        color={
                          displayAbilityToChangeTextColor.type === 'firstName'
                            ? gamer.firstName.color
                            : gamer.username.color
                        }
                        onChange={handleTextColorChange}
                        onChangeComplete={handleSaveTextColor}
                      />
                    </TextColorChangerContainer>
                  )}
                  <span onClick={() => setShowEditName(!showEditName)}>
                    edit
                  </span>
                </ChildContainer>
              </InnerBlock>
            </FirstBlock>
            <Description
              onDoubleClick={() => setShowEditDescription(!showEditDescription)}
            >
              {showEditDescription ? (
                <Form>
                  <textarea
                    name='textArea'
                    autoFocus={true}
                    onChange={(e) => setTextArea(e.target.value)}
                  ></textarea>
                </Form>
              ) : (
                <p>{gamer.description}</p>
              )}
            </Description>
            <div className='submit-description'>
              {showEditDescription && (
                <input
                  className='submit-description-input'
                  onClick={submitText}
                  type='submit'
                  value='Submit'
                />
              )}
            </div>

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
          {/* <Form onSubmit={submitText}>
            <textarea
              name='textArea'
              onChange={(e) => setTextArea(e.target.value)}
            ></textarea>
            <input type='submit' value='Submit' />
          </Form> */}
        </StyleWrapper1>
      )}
    </>
  );
};

export default GamerProfile;

const TextColorChangerContainer = styled.div`
  width: 14rem;
  transform: translate(85%, -50%);
`;

const H3 = styled.h3`
  color: ${({ color }) => ` ${color}`};
`;

const H2 = styled.h2`
  color: ${({ color }) => ` ${color}`};
`;

const H1 = styled.h1`
  color: ${({ color }) => ` ${color}`};
`;
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

  top: 5.5em;
  padding: 0.5em;
  width: 416px;
  border-radius: 3px;
  background: #2c2f33;
  box-shadow: rgba(18, 0, 12, 0.8) 0px 6px 12px -2px,
    rgba(18, 0, 12, 0.8) 0px 3px 7px -3px;

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
  height: 40%;
  overflow-y: auto;

  /* background-color: #394244; */
  padding: 1em 0 1em 0;
  position: relative;
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

  .image-container {
    position: relative;
    width: 12rem;
    height: 12rem;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 2px 3px 4px 1px rgba(18, 0, 12, 0.4);
    border: 1px solid #99aab5;
    :active {
      box-shadow: 3px 4px 5px 2px rgba(18, 0, 12, 0.4);
    }

    .change-profile-picture {
      opacity: 0.5;
    }
  }

  img {
    position: absolute;
    max-width: 100%;
    width: 100%;
    height: 100%;
    inset: 0;
    margin: auto;
    cursor: pointer;
    object-fit: cover;
  }
  .submit-description-input {
    padding: 0.38em 0em;
    width: 100%;
    background: none;
    color: #0153af;
    font-weight: bolder;
    border: 2px solid #0153af;
    outline: none;
    text-decoration: none;
    border-radius: 2px;
    cursor: pointer;
    transition: background 200ms, color 200ms;

    :hover {
      background: #0153af;
      color: white;
    }
  }

  .submit-description {
    width: 96.5%;
    padding: 0 0em;
    position: absolute;
    bottom: 7.2em;
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
  width: 94%;
  height: 85%;
  padding: 0.5em;
  position: absolute;

  textarea {
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: 2px solid #99aab5;
    border-radius: 1px;
    text-decoration: none;
    transition: border 200ms;
    font-size: 1rem;
    color: #99aab5;
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
    outline: none;
    transition: border 200ms;
    :focus {
      border: 2px solid #ef99f7;
    }
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

const EditProfilePicture = styled.div`
  position: absolute;
  color: lightblue;
  pointer-events: none;
  font-size: 1.1rem;
  inset: 0;
  margin: auto;
  height: 1.5em;
`;
