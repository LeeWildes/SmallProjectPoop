import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';

const App = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path = "/" component={Login}/>
        <Route path = "/login" component={Login}/>
        <Route path = "/home" component={Home}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
