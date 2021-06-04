import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GamerProfile from './Components/GamerProfile';
import Navbar from './Components/Navbar';
import ErrorPage from './Components/ErrorPage';
import About from './Components/About';
import Login from './Components/Login';
import Register from './Components/Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

ReactDOM.render(
   <React.StrictMode>
      <Router>
         <Navbar />
         <Switch>
            <Route exact path='/'>
               <App />
            </Route>
            <Route path='/about'>
               <About />
            </Route>
            <Route path='/login'>
               <Login />
            </Route>
            <Route path='/register'>
               <Register />
            </Route>
            <Route path='/profile/:id' children={<GamerProfile />}>
               {/* <GamerProfile /> */}
            </Route>
            <Route path='*'>
               <ErrorPage />
            </Route>
         </Switch>
      </Router>
   </React.StrictMode>,
   document.getElementById('root')
);
