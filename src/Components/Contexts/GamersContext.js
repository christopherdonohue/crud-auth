import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const gamersContext = React.createContext();
export const GamersContext = (props) => {
  const [gamers, setGamers] = useState();
  const [newUserRegistered, setNewUserRegistered] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/findAll")
      .then((res) => {
        console.log(res);
        setGamers(res.data);
      })
      .then((err) => {
        return err;
      });

    return () => setNewUserRegistered(false);
  }, [newUserRegistered]);

  return (
    <gamersContext.Provider
      value={{ gamers, setGamers, newUserRegistered, setNewUserRegistered }}
    >
      {props.children}
    </gamersContext.Provider>
  );
};
