import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser } from "modules/redux";
import { MovieEntry } from "../MovieEntry";
import { handleResponse, requestOptions } from "../../services/networking";
import config from 'config/default.json';

class TopMovies extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dbMovies: [],
      tmdbMovies: []
    }

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.requestTopDbUserMovies = this.requestTopDbUserMovies.bind(this);
    this.requestTopTmdbUserMovies = this.requestTopTmdbUserMovies.bind(this);
  }

  componentDidMount() {
    this.requestTopDbUserMovies();
    this.requestTopTmdbUserMovies();
  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  requestTopDbUserMovies() {
    fetch(`${config.apiUrl}/movies/db/top`, requestOptions)
      .then(handleResponse)
      .then(movies => {
        this.setState({
          dbMovies: movies
        })
      });
  }

  requestTopTmdbUserMovies() {
    fetch(`${config.apiUrl}/movies/tmdb/top`, requestOptions)
      .then(handleResponse)
      .then(movies => {
        this.setState({
          tmdbMovies: movies
        })
      });
  }

  render() {
    const { user } = this.props;
    let { tmdbMovies, dbMovies } = this.state;
    return (
      <Page
        title="MovieMonster - Top Movies"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>        
        <div className="moviesHomeSection topMoviesSection">
          <div className="topMovie">
            {tmdbMovies ? (tmdbMovies.length > 0 && tmdbMovies.map((movieEntry, index) =>
              <MovieEntry movie={movieEntry} key={"movieEntryTmdb" + index.toString()}
                index={index} source="TMDB" />)) : "Nema rezultata"}
          </div>
          <div className="topMovie">
            {dbMovies ? (dbMovies.length > 0 && dbMovies.map((movieEntry, index) =>
              <MovieEntry movie={movieEntry} key={"movieEntryTmdb" + index.toString()}
                source="DB" />)) : "Nema rezultata"}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMovies));
