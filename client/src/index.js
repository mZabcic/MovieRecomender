import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from "redux";
import './index.css';
import {
  Home,
  Profile,
  About,
  Genres,
  Contact,
  Top100
} from 'modules/pages';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { middleware, rootReducer } from 'modules/redux';

const store = createStore(rootReducer, middleware);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/genres" component={Genres} />
        <Route path="/top-100" component={Top100} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
