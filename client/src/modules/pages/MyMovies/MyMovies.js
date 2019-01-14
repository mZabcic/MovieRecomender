import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { MovieEntry } from "../MovieEntry";
import { logoutUser, getUser } from "modules/redux";
import { handleResponse, requestOptions } from "../../services/networking";
import config from 'config/default.json';
import Select from 'react-select'

class MyMovies extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      genres: []
    }

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.requestUserMovies = this.requestUserMovies.bind(this);
    this.requestGenres = this.requestGenres.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
  }

  componentWillMount() {
    this.requestGenres();
  }

  componentDidMount() {
    this.requestUserMovies();
  }

  requestGenres() {
    fetch(`${config.apiUrl}/movies/genres`, requestOptions)
      .then(handleResponse)
      .then(genres => {
        let myArray = [];
        genres.map(function (item) {
          myArray.push({ label: item.name, value: item.name });
        });
        this.setState({
          genres: myArray
        })
      });
  }

  requestUserMovies() {
    fetch(`${config.apiUrl}/movies`, requestOptions)
      .then(handleResponse)
      .then(movies => {
        this.setState({
          movies: movies
        })
      });
  }

  handleGenreChange(event) {
    fetch(`${config.apiUrl}/movies/genres/` + event.value.toString(), requestOptions)
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
        <div>

          <div className="moviesHomeSection myMoviesSection">
            <Select options={this.state.genres} onChange={this.handleGenreChange} />
            {movies ? (movies.length > 0 && movies.map((movieEntry, index) =>
              <MovieEntry movie={movieEntry} key={"movieEntryTmdb" + index.toString()} />)) : "Nema rezultata"}
          </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyMovies));
