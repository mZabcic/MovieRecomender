import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser } from "modules/redux";
import { handleResponse, requestOptions } from "../../services/networking";
import { MovieEntry } from "../MovieEntry";
import config from 'config/default.json';
const queryString = require("query-string");

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleSearchMoviesQuery = this.handleSearchMoviesQuery.bind(this);
  }

  componentDidMount() {
    let parsed = queryString.parse(this.props.location.search);
    this.handleSearchMoviesQuery(parsed.query);
  }

  handleSearchMoviesQuery(query) {
    fetch(`${config.apiUrl}/movies/search?term=` + query, requestOptions)
      .then(handleResponse)
      .then(movies => {
        console.log({ movies });
        this.setState({
          movies: movies
        })
      });
  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  render() {
    const { movies } = this.state;
    const { omdb, tmdb } = movies;
    return (
      <Page
        title={`MovieMonster - Search`}
        onLogoutClick={this.handleLogoutClick}
        loggedIn>
        <div className="moviesHomeSection myMoviesSection">
          <div>
            <label>The Movie DB search results:</label>
            {tmdb ? (tmdb.results.length > 0 && tmdb.results.map((movieEntry, index) =>
              <MovieEntry movie={movieEntry} key={"movieEntryTmdb" + index.toString()} />)) : ""}
            {tmdb ? tmdb.results.length === 0 && <label>No movies found on The Movie DB</label> : ""}
          </div>
          <div>
            <label>OMBD search results:</label>
            {omdb ? (omdb.Search.length > 0 && omdb.Search.map((movieEntry, index) =>
              <MovieEntry movie={movieEntry} key={"movieEntryOmdb" + index.toString()}
                source="OMDB" />)) : ""}
            {omdb ? omdb.Search.length === 0 && <label>No movies found on OMDB</label> : ""}
          </div>

        </div>
      </Page>
    );
  }
}


function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));
