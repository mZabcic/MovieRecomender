import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { MovieEntry } from "../MovieEntry";
import { logoutUser, getUser } from "modules/redux";
import { handleResponse, requestOptions } from "../../services/networking";
import config from 'config/default.json';

class MyMovies extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      movies: []
    }

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.requestUserMovies = this.requestUserMovies.bind(this);
  }

  componentDidMount() {
    this.requestUserMovies();
  }

  requestUserMovies() {
    fetch(`${config.apiUrl}/movies`, requestOptions)
      .then(handleResponse)
      .then(movies => {
        console.log({movies})
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
    let movies = this.state.movies;
    return (
      <Page
        title="MovieMonster - My Movies"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>
        <div className="moviesHomeSection">
        {movies ? (movies.length > 0 && movies.map((movieEntry, index) =>
            <MovieEntry movie={movieEntry} key={"movieEntryTmdb" + index.toString()} />)) : "Nema rezultata"}
        </div>
      </Page>
    );
  }
}


function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyMovies));
