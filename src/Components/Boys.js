import { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";

const Boys = ({ gamers, setGamers, setHiddenProfiles, stack }) => {
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

  useEffect(() => {
    console.log(gamers);
  }, []);

  return (
    // <>

    //    {gamers.map((gamer, index) => {
    //       const { id, firstName, imageUrl, classType, Description } = gamer;
    <div>
      {gamers.map((item) => {
        return <h2>{item.username}</h2>;
      })}
    </div>
    // return (
    //    gamer.showProfile && (
    //       <BoyStyle key={id} className='boyStyle'>
    //          <img
    //             draggable='true'
    //             onDragStart={() => handleDragStart(index)}
    //             onDragOver={(e) => handleDragOver(e)}
    //             onDrop={(e) => handleDrop(e, index)}
    //             src={imageUrl}
    //             alt='Gamer'
    //             onClick={() => handleClick(id, 'single')}
    //             onDoubleClick={() => handleClick(id, 'double')}
    //          ></img>
    //          <h2>{firstName}</h2>
    //          {gamer.viewProfile && (
    //             <Profile>
    //                <h4
    //                   className={
    //                      classType === 'Grand Master'
    //                         ? 'grandMaster'
    //                         : 'master'
    //                   }
    //                >
    //                   {classType}
    //                </h4>

    //                <p>{Description}</p>

    //                <Link
    //                   style={{
    //                      color:
    //                         classType === 'Grand Master'
    //                            ? 'rgb(52, 152, 219)'
    //                            : 'rgb(245, 207, 250)',
    //                      textDecoration: 'none',
    //                   }}
    //                   to={`/profile/${id}`}
    //                >
    //                   View Profile
    //                </Link>
    //             </Profile>
    //          )}
    //       </BoyStyle>
    //    )
    // );
    // })}
    // </>
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
