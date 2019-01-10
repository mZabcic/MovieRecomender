import React, { Component } from 'react';
import { images } from 'assets';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <header className="Home-header">
          <img src={images.logo} className="Home-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and my nigga to reload.
          </p>
          <a
            className="Home-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default Home;
