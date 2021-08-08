import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toast } from '../StyledComponents/toastNotificationStyles';

export const gamersContext = React.createContext();
export const GamersContext = (props) => {
  const [gamers, setGamers] = useState();
  const [updateListofGamers, setUpdateListofGamers] = useState(false);
  const [toastNotification, setToastNotification] = useState({});
  let timeoutVariable = useRef();

  useEffect(() => {
    axios
      .get('http://localhost:3001/auth/findAll')
      .then((res) => {
        console.log(res);
        setGamers(res.data);
      })
      .then((err) => {
        return err;
      });

    return () => setUpdateListofGamers(false);
  }, [updateListofGamers]);

  useEffect(() => {
    if (
      toastNotification.type &&
      toastNotification.type !== `Registration-Error`
    ) {
      window.clearTimeout(timeoutVariable.current);
      timeoutVariable.current = setTimeout(() => {
        setToastNotification({});
      }, 10000);
    }
  }, [toastNotification]);

  return (
    <gamersContext.Provider
      value={{
        gamers,
        setGamers,
        updateListofGamers,
        setUpdateListofGamers,
        toastNotification,
        setToastNotification,
      }}
    >
      {props.children}
    </gamersContext.Provider>
  );
};
