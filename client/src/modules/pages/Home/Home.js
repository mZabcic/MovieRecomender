import React, { PureComponent } from 'react';
import { images } from 'modules/assets';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './Home.css';

class Home extends PureComponent {
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

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
