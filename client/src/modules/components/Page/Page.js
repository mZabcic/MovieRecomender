import React, { PureComponent } from "react";
import { history } from "modules/services";
import "./Page.css";
import { Helmet } from "react-helmet";

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
    const { value } = event.target;
    this.setState({ search: value });
  }

  handleSearchSubmit() {
    const { search } = this.state;
    console.log(search);
    history.push(`/search?query=${search}`);
  }



  render() {
    const { children, loggedIn, onLogoutClick, user, title } = this.props;
    return (
      <div className="app">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {loggedIn &&
          <header > 
          <div class="navigation holder" >
            <ul class="text-font">
              <li class="middle left"><a href="/"><b>M</b>ovie<b>M</b>onster</a></li>
              <li class="half center space-right">
                <form onSubmit={this.handleSearchSubmit}>
                <input className="form-control" type="text" onChange={this.handleSearchChange} />
                <input type="submit" value="Search" className="btn btn-primary" />
                </form>
              </li>
              <li class="quarter right"><a href="/my-movies">My movies</a></li>
              <li class="quarter right"><a href="/top-movies">Top movies</a></li>            
              <li class="quarter right"><a href="/about">About</a></li>
              <li class="quarter right"><a href="/contact">Contact</a></li>
              <li class="quarter right"><a href="/profile">Profile</a></li>
              <li class="quarter right"><a href="/profile"><button class="btn btn-light" onClick={onLogoutClick}>Log Out</button></a></li>
            </ul> 
          </div>
          </header>
        } 
          {children} 
        {loggedIn &&
          <footer>
          <div className="footer holder">
            <ul className="footer-list">
              <li className="half2 center">2019&copy; <b>M</b>ovie<b>M</b>onster</li><li class="half2 center"><a href="http://165.227.128.66/api-docs#/">API documentation</a></li>
            </ul>
          </div> 
          </footer>}
      </div>
    );
  }
}

Page.defaultProps = {
  loggedIn: false,
  title: "MovieMonster"
}


