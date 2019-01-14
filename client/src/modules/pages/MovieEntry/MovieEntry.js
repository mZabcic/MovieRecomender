import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser, getUser, fetchUser } from "modules/redux";
import { handleResponse, requestOptionsPost, requestOptions, requestOptionsDelete } from "modules/services/networking";
import config from 'config/default.json';

class MovieEntry extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      favourite: false
    }

    this.handleFavourite = this.handleFavourite.bind(this);
  }

  componentDidMount() {
    this.props.fetchUserAction();
    if (this.props.movie) {
      this.setState({
        favourite: this.props.movie.userLiked
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.movie.userLiked != prevProps.movie.userLiked) {
      this.setState({
        favourite: this.props.movie.userLiked
      });
    }
  }

  handleFavourite() {
    let movie = this.props.movie;
    if (!this.state.favourite) {
      if (movie.source == "FB") {
        console.log();
      }
      else if (movie.source == "TMDB") {
        fetch(`${config.apiUrl}/movies/tmdb/` + movie._id, requestOptionsPost)
          .then(handleResponse => {
            console.log("handleResp: ", handleResponse);
          })
          .then(movie => {
            this.setState({
              favourite: !this.state.favourite
            })
          });
      }
      else if (movie.source == "TMDB") {
        console.log();
      }
    }
    else {
      fetch(`${config.apiUrl}/movie/` + movie._id + `/users/` + this.props.user._id, requestOptionsPost)
          .then(handleResponse => {
            console.log("handleResp: ", handleResponse);
          })
          .then(movie => {
            this.setState({
              favourite: !this.state.favourite
            })
          });
    }
  }

  render() {
    const { movie, user } = this.props;
    return (
      <div>
        <a href={movie.homepage}>
          <div className="movieBox">
            <p><b>{movie.name}</b></p>
            <hr />
            <div className="movieFlex">
              <div><img src={movie.cover} /></div>
              <div>
                <p>{movie.description}</p>
                <p><b>Released:</b> {movie.release_date}</p>
                <p><b>Rating:</b> {movie.fan_count}</p>
              </div>
            </div>
          </div>
        </a>
        <div><a onClick={() => this.handleFavourite()}>ZVJEZDICA</a></div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser, fetchUserAction: fetchUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovieEntry));
