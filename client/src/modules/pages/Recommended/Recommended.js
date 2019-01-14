import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { MovieEntry } from "../MovieEntry";
import { logoutUser, getUser } from "modules/redux";
import { handleResponse, requestOptions } from "modules/services/networking";
import config from 'config/default.json';

class Recommended extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      movies: []
    }

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.requestRecommendedMovies = this.requestRecommendedMovies.bind(this);
  }

  componentDidMount() {
    this.requestRecommendedMovies();
  }

  requestRecommendedMovies() {
    fetch(`${config.apiUrl}/movies/recommend`, requestOptions)
      .then(handleResponse)
      .then(movies => {
        console.log({ movies })
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
    const { user } = this.props;
    const { movies } = this.state;
    console.log({ movies });
    return (
      <Page
        title="MovieMonster - Recommended"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>
        <div className="moviesHomeSection myMoviesSection">
          {movies.results ? (movies.results.length > 0 && movies.results.map((movieEntry, index) =>
            <MovieEntry movie={movieEntry} key={"movieEntryTmdb" + index.toString()} />)) : "No results"}
        </div>
        &nbsp;
      </Page>
    );
  }
}


function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Recommended));
