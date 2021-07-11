import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { StyleWrapper } from "./StyledComponents/formStyles";
import { gamersContext } from "./Contexts/GamersContext";

const GamerProfile = () => {
  const { newUserRegistered, setNewUserRegistered, gamers } =
    useContext(gamersContext);
  const location = useLocation();
  const [image, setImage] = useState();
  const [gamer, setGamer] = useState(
    location.state ? location.state.gamer : {}
  );
  const [textArea, setTextArea] = useState("");

  const [showImageUploadComponent, setShowImageUploadComponent] =
    useState(false);
  const { id } = useParams();
  let data;
  let files;

  const handleImageChange = (e) => {
    files = e.target.files;
    data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "cookoutlogs");
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
        "http://localhost:3001/auth/description",
        { data: textArea, datePosted: Date.now() },
        {
          headers: {
            authorization: `token: ${localStorage.getItem("token")}`,
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
      .post(
        `http://localhost:3001/gamers/delete`,
        {},
        {
          headers: {
            authorization: `token: ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    if (image) {
      console.log(`image`);
      axios
        .post(
          "http://localhost:3001/gamers/uploadProfilePicture",
          {
            profilePicture: gamer.profilePicture,
          },
          {
            headers: {
              authorization: `token: ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          console.log(`response from image`);
          setNewUserRegistered(true);
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
      {gamer && (
        <StyleWrapper1>
          <SingularGamer>
            <h1>{gamer.firstName}</h1>
            <h2>{gamer.username}</h2>
            <img
              onClick={() =>
                setShowImageUploadComponent(!showImageUploadComponent)
              }
              src={gamer.profilePicture}
              alt="Profile Picture"
            />
            <Description>
              <p>{gamer.description}</p>
            </Description>
            <span onClick={handleDeleteAccount}>DELETE ACCOUNT</span>
          </SingularGamer>

          {showImageUploadComponent && (
            <ImageUploadForm onSubmit={submitImage}>
              <h4>Change Profile Picture</h4>
              <input
                type="file"
                name="imageFile"
                onChange={handleImageChange}
              />
              <div>
                <input className="upload-button" type="submit" value="Upload" />
              </div>
            </ImageUploadForm>
          )}
          <Form onSubmit={submitText}>
            <textarea
              name="textArea"
              onChange={(e) => setTextArea(e.target.value)}
            ></textarea>
            <input type="submit" value="Submit" />
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
  box-shadow: 6px 6px 4px 1px #23272a;

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
  margin-top: 1em;
  padding: 5px;
  border: 2px solid #23272a;
  border-radius: 4px;
  width: 80%;
  height: auto;
  overflow-y: auto;
`;

const SingularGamer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1em;
  background-color: #2c2f33;
  box-shadow: 6px 6px 4px 1px #23272a;
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
    box-shadow: 6px 6px 4px 1px #23272a;
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
  box-shadow: 3px 3px 2px 1px #23272a;

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
  box-shadow: 3px 3px 2px 1px #23272a;

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
