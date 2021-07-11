import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router";
import styled from "styled-components";
import { gamersContext } from "./Contexts/GamersContext";
import GamerProfile from "./GamerProfile";

const Boys = () => {
  const { gamers, setGamers } = useContext(gamersContext);
  const [editProfile, setEditProfile] = useState();
  const [loggedInGamer, setLoggedInGamer] = useState();
  const history = useHistory();

  const editProfileFn = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:3001/gamers/findOne`,
        {},
        {
          headers: {
            authorization: `token: ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setEditProfile(res.data.gamer);
        return res;
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    console.log(gamers);
    if (editProfile) {
      history.push({
        pathname: `/profile/${editProfile._id}`,
        state: { gamer: editProfile },
      });
    }
  }, [editProfile]);

  useEffect(() => {
    axios
      .post(
        `http://localhost:3001/gamers/findOne`,
        {},
        {
          headers: {
            authorization: `token: ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setLoggedInGamer(res.data.gamer);
        return res;
      })
      .catch((err) => {
        return err;
      });
  }, []);

  return (
    <>
      {gamers &&
        gamers.map((item) => {
          return (
            <>
              <BoyStyle>
                <Profile>
                  <h2>{item.username}</h2>
                  <img src={item.profilePicture} alt={"Profile Picture"} />
                  <div>
                    <p>{item.description}</p>
                  </div>
                  {loggedInGamer && loggedInGamer._id === item._id && (
                    <span onClick={editProfileFn}>Edit Profile</span>
                  )}
                </Profile>
              </BoyStyle>
            </>
          );
        })}
    </>
  );
};

export default Boys;

const BoyStyle = styled.div`
  text-align: center;
  margin: 1em;
  max-width: 300px;

  img {
    border-radius: 50%;
    cursor: pointer;
    width: 120px;
    /* min-width: 100px; */
    height: 120px;
    /* min-height: 100px; */
  }

  span {
    cursor: pointer;
    bottom: 1em;
    position: absolute;
    color: #ef99f7;
  }
`;

const Profile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: gray;
  background-color: #2c2f33;
  border-radius: 3px;
  min-width: 200px;
  max-width: 300px;
  height: 55vh;
  box-shadow: 3px 5px 4px 1px #23272a;
  overflow-y: auto;

  h2 {
    color: #99aab5;
  }

  div {
    margin-top: 3em;
    padding: 3px;
    text-align: center;
    color: #99aab5;
    width: 75%;
    border: 2px solid #23272a;
    border-radius: 3px;
  }
`;
