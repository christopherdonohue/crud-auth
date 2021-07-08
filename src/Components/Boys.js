import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router";
import styled from "styled-components";
import { gamersContext } from "./Contexts/GamersContext";
import GamerProfile from "./GamerProfile";

const Boys = () => {
  const { gamers, setGamers } = useContext(gamersContext);
  const [editProfile, setEditProfile] = useState();
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
                  <p onClick={editProfileFn}>Edit Profile</p>
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
    padding-top: 5px;
    border-radius: 50%;
    cursor: pointer;
    width: 100px;
    height: auto;
  }

  span {
    cursor: pointer;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: gray;
  background-color: #2c2f33;
  min-width: 200px;
  max-width: 300px;
  height: 55vh;
  box-shadow: 5px 5px 4px 1px #23272a;
  overflow-y: auto;

  .grandMaster {
    color: rgb(52, 152, 219);
  }

  .master {
    color: rgb(245, 207, 250);
  }

  Link {
    padding-bottom: 10px;
  }
`;
