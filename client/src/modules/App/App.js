import React, { PureComponent } from 'react';
import { Home } from 'modules/pages/Home';
import { Profile } from "modules/pages/Profile";
import { About } from "modules/pages/About";
import { Login } from "modules/pages/Login";
import { Contact } from "modules/pages/Contact";
import { TopMovies } from "modules/pages/TopMovies";
import { MyMovies } from 'modules/pages/MyMovies';
import { PrivateRoute } from "modules/components";
import { Router, Route, Switch } from "react-router-dom";
import { history } from "modules/services";
import { fetchUser } from '../redux/actions/user';

export default class App extends PureComponent {
  render() {
    return (
      <Router history={history} forceRefresh={true}>
        <Switch>
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/about" component={About} />
          <PrivateRoute path="/contact" component={Contact} />
          <PrivateRoute path="/top-movies" component={TopMovies} />
          <PrivateRoute path="/my-movies" component={MyMovies} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Home} />
        </Switch>
      </Router>
    );
  }
}
