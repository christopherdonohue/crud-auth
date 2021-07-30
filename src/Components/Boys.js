import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import { gamersContext } from './Contexts/GamersContext';
import GamerProfile from './GamerProfile';

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
            authorization: `token: ${localStorage.getItem('token')}`,
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
            authorization: `token: ${localStorage.getItem('token')}`,
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
                  {item.username.length <= 20 ? (
                    <h2>{item.username}</h2>
                  ) : (
                    <h4>{item.username}</h4>
                  )}
                  <div className='image-container'>
                    <img src={item.profilePicture} alt={'Profile Picture'} />
                  </div>
                  <EditProfileAndDescriptionContainer>
                    {loggedInGamer && loggedInGamer._id === item._id && (
                      <div className='span'>
                        <span onClick={editProfileFn}>Edit Profile</span>
                      </div>
                    )}
                    {item.description && (
                      <div className='description'>
                        <p>{item.description}</p>
                      </div>
                    )}
                  </EditProfileAndDescriptionContainer>
                  <ProfileBottom>
                    <p>{`Total Posts: ${item.posts.length}`}</p>
                  </ProfileBottom>
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

  .image-container {
    position: relative;
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 3px 3px 3px 1px rgba(18, 0, 12, 0.4);
  }

  img {
    position: absolute;
    max-width: 100%;
    width: 100%;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img.landscape {
    height: 100%;
    width: auto;
  }

  .total-posts {
    position: absolute;
    bottom: 1.5em;
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
  width: 15vw;
  min-width: 250px;
  height: 55vh;
  min-height: 470px;
  box-shadow: 3px 3px 4px 1px rgba(18, 0, 12, 0.6);
  overflow-y: auto;

  h2,
  h4 {
    color: #99aab5;
  }

  .description {
    /* top: 50%;
    left: 50%;
    transform: translate(-50%, 0%); */

    text-align: center;
    color: #99aab5;
    width: 92%;
    max-height: 150px;
    overflow-y: auto;
  }
`;

const ProfileBottom = styled.div`
  width: 100%;
  background-color: #393c44;
  text-align: center;
  bottom: 0;
  position: absolute;
`;

const EditProfileAndDescriptionContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  justify-content: space-around;
  gap: 1em;

  padding: 0.5em;
  width: 90%;
  height: 35%;

  span {
    color: #ef99f7;
    cursor: pointer;
  }
`;
