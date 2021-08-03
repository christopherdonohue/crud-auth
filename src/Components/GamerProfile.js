import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { StyleWrapper } from './StyledComponents/formStyles';
import { gamersContext } from './Contexts/GamersContext';

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
    axios
      .put(`http://localhost:3001/gamers/${gamer._id}`, {
        firstName: editFirstNameAndUsername.firstName,
        username: editFirstNameAndUsername.username,
      })
      .then((res) => {
        console.log(res);
        setGamer({
          ...gamer,
          firstName: editFirstNameAndUsername.firstName,
          username: editFirstNameAndUsername.username,
        });
        setUpdateListofGamers(true);
        setShowEditName(false);
        return res;
      })
      .catch((err) => err);
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
                <img
                  onClick={() =>
                    setShowImageUploadComponent(!showImageUploadComponent)
                  }
                  src={gamer.profilePicture}
                  alt='Profile Picture'
                />
                <ChildContainer>
                  {showEditName ? (
                    <InputContainer>
                      <div>
                        <label for='editName'>First Name</label>
                        <input
                          type='text'
                          name='editName'
                          placeholder='Enter New Name...'
                          onChange={(e) =>
                            setEditFirstNameAndUsername({
                              ...editFirstNameAndUsername,
                              firstName: e.target.value,
                            })
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
                            setEditFirstNameAndUsername({
                              ...editFirstNameAndUsername,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button onClick={handleEditName}>Submit</button>
                    </InputContainer>
                  ) : (
                    <>
                      <h1>{gamer.firstName}</h1>
                      <h2>{gamer.username}</h2>
                    </>
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
  margin-top: 1em;
  padding: 0.5em;
  width: 416px;
  border-radius: 3px;
  background: #2c2f33;
  box-shadow: 4px 3px 4px 1px rgba(18, 0, 12, 0.7);

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
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  /* padding: 1em; */
  background-color: #2c2f33;
  box-shadow: 4px 3px 4px 1px rgba(18, 0, 12, 0.7);
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

  img {
    border-radius: 50%;
    width: 200px;
    height: 200px;
    box-shadow: 4px 3px 4px 1px rgba(18, 0, 12, 0.7);
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
  box-shadow: 4px 3px 4px 1px rgba(18, 0, 12, 0.7);

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
  box-shadow: 4px 3px 4px 1px rgba(18, 0, 12, 0.7);

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
`;

const ChildContainer = styled.div`
  position: absolute;
  width: 45%;
  height: 100%;

  right: 0.5em;
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
    background-color: #99aab5;
    border: 2px solid #99aab5;
    border-radius: 2px;
  }

  button {
    border: 2px solid #99aab5;
    background: none;
    color: #99aab5;
    font-weight: bold;
    border-radius: 2px;
    transition: background 200ms, color 200ms;
    margin-top: 1em;

    :hover {
      background-color: #99aab5;
      color: white;
      cursor: pointer;
    }
  }
`;
