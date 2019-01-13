import React, { PureComponent } from "react";
import "./Page.css";

export default class Page extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    }

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(event) {
    this.setState({ search: event });

    console.log(event);
  }

  handleSearchSubmit() {
    const { search } = this.state;
    console.log(search);
  }



  render() {
    const { children, loggedIn, onLogoutClick, user } = this.props;
    return (
      <div className="limiter">
        {loggedIn &&
          <header >
            <div>
              <a href="/">Home</a>
              <a href="/my-movies">My Movies</a>
              <a href="/top-movies">Top Movies</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
            <form onSubmit={this.handleSearchSubmit}>
              <input type="text" onChange={this.handleSearchChange} />
              <input type="submit" value="Search" />
            </form>
            <div>
              <a href="/profile">Profile</a>
              <button onClick={onLogoutClick}>Log Out</button>
            </div>
          </header>
        }
        <div className="container">
          {children}
        </div>
        {loggedIn &&
          <footer>
            <div>
              <a href="/">Home</a>
              <a href="/my-movies">My Movies</a>
              <a href="/top-movies">Top Movies</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/profile">Profile</a>
            </div>
            <div>
              <p>FER</p>
              <p>Unska 3</p>
              <p>10000, Zagreb</p>
            </div>
            <div>
              <a href="http://165.227.128.66/api-docs#/">API documentation</a>
              <a href="/">Project Documentation</a>
              <p>Movie Monster</p>
              <p>2018/2019</p>
            </div>
          </footer>}
      </div>
    );
  }
}

Page.defaultProps = {
  loggedIn: false
}


