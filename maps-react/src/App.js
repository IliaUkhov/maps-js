import React from 'react';
import './App.css';
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import MapView from "./MapView";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import store from "./Store";
import PrivateRoute from './PrivateRoute';

const Provider = require("react-redux").Provider;

class App extends React.Component {
  render ()	{
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Redirect exact path="/" to="/signin"/>
            <PrivateRoute exact path="/map" component={MapView}/>
            <Route exact path="/signin" component={SignIn}/>}/>
            <Route exact path="/signup" component={SignUp}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
