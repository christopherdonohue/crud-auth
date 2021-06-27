import { useContext } from "react";
import styled from "styled-components";
import { gamersContext } from "./Contexts/GamersContext";

const Boys = () => {
  const { gamers, setGamers } = useContext(gamersContext);

  return (
    <>
      {gamers &&
        gamers.map((item) => {
          return (
            <>
              <BoyStyle>
                <Profile>
                  <h2>{item.username}</h2>
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
