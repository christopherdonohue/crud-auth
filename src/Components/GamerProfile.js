import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { StyleWrapper } from "./StyledComponents/formStyles";

const GamerProfile = () => {
  const location = useLocation();
  const [image, setImage] = useState();
  const [gamer, setGamer] = useState(
    location.state ? location.state.gamer : {}
  );
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
        setImage(res.data.secure_url);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  useEffect(() => {
    if (image) {
      axios
        .post(
          "http://localhost:3001/gamers/uploadProfilePicture",
          {
            profilePicture: image,
          },
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
    }
  }, [image]);

  return (
    <>
      {gamer && (
        <StyleWrapper1>
          <Container>
            <SingularGamer>
              <h1>{gamer.firstName}</h1>
              <h2>{gamer.username}</h2>
              <img src={gamer.profilePicture} alt="Profile Picture" />
            </SingularGamer>
          </Container>
          <ImageUploadForm onSubmit={submitImage}>
            <h4>Change Profile Picture</h4>
            <input type="file" name="imageFile" onChange={handleImageChange} />
            <div>
              <input className="upload-button" type="submit" value="Upload" />
            </div>
          </ImageUploadForm>
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

const Container = styled.div`
  display: flex;
  align-items: baseline;
  padding-top: 8em;
  justify-content: center;
  margin: 0 auto;
  width: 23%;
`;

const ImageUploadForm = styled.form`
  text-align: center;
  margin-top: 1em;
  padding: 1em;
  width: 300px;
  border-radius: 3px;
  background: #2c2f33;

  .upload-button {
    margin-top: 1em;
    padding: 4px;
    background: none;
    width: 95%;
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

const SingularGamer = styled.div`
  text-align: center;
  padding: 1em;
  background-color: #2c2f33;
  box-shadow: 6px 6px 4px 1px #23272a;
  color: gray;

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
    height: auto;
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
