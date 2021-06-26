import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";

const Boys = ({ gamers, setGamers, setHiddenProfiles, stack }) => {
  const [textArea, setTextArea] = useState("");

  const handleClick = (id, whichClick) => {
    setGamers(
      // eslint-disable-next-line array-callback-return
      [...gamers].map((gamer) => {
        if (gamer.id === id) {
          switch (whichClick) {
            case "single":
              return { ...gamer, viewProfile: !gamer.viewProfile };
            case "double":
              stack.push(gamers);
              setHiddenProfiles(gamers);
              return { ...gamer, showProfile: false };
            default:
              console.log("Error");
          }
        } else {
          return gamer;
        }
      })
    );
  };

  var temp;
  var tempIndex;
  var gamersClone = cloneDeep(gamers);

  const handleDragStart = (index) => {
    tempIndex = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault(); // This prevents image from opening in new tab on firefox
    temp = gamersClone[index];
    gamersClone[index] = gamersClone[tempIndex];
    gamersClone[tempIndex] = temp;
    setGamers(gamersClone);
  };

  const submitText = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/auth/create",
        { data: textArea },
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
    console.log(gamers);
  }, []);

  return (
    <>
      {gamers.map((item) => {
        return (
          <>
            <BoyStyle>
              <Profile>
                <h2>{item.username}</h2>
                <p>{textArea}</p>
                <form onSubmit={submitText}>
                  <textarea
                    name="textArea"
                    onChange={(e) => setTextArea(e.target.value)}
                  ></textarea>
                  <input type="submit" />
                </form>
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
  flex: 1 1 0px;
  text-align: center;
  margin: 0.5em;
  max-width: 300px;
  img {
    padding-top: 5px;
    border-radius: 50%;
    cursor: pointer;
  }

  span {
    cursor: pointer;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
