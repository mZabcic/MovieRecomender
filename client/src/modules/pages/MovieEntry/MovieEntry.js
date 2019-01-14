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
        favourite: this.props.movie.userLiked == 1 ? true : false
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.movie.userLiked != prevProps.movie.userLiked) {
      this.setState({
        favourite: this.props.movie.userLiked == 1 ? true : false
      });
    }
  }

  handleFavourite(e) {
    console.log( "handle favorite" );
    e.preventDefault();
    let movie = this.props.movie;
    // ADD TO FAVOURITE
    if (!this.state.favourite) {
      if ((movie.source ? movie.source : this.props.source) == "DB") {
        fetch(`${config.apiUrl}/movie/` + movie.id + `/users/` + this.props.user._id, requestOptionsPost)
        .then(handleResponse => {
          if (handleResponse.ok) {
            this.setState({
              favourite: !this.state.favourite
            })
          }
          console.log("handleResp: ", handleResponse);
        })
        .then(movie => { });
      }
      else if ((movie.source ? movie.source : this.props.source) == "TMDB") {
        fetch(`${config.apiUrl}/movies/tmdb/` + movie.id, requestOptionsPost)
          .then(handleResponse => {
            if (handleResponse.ok) {
              this.setState({
                favourite: !this.state.favourite
              })
            }
          })
          .then(movie => { });
      }
      else if (movie.id == undefined) {
        fetch(`${config.apiUrl}/movies/omdb/` + movie.imdbID, requestOptionsPost)
          .then(handleResponse => {
            if (handleResponse.ok) {
              this.setState({
                favourite: !this.state.favourite
              })
            }
          })
          .then(movie => { 
          });
      }
      else{
        fetch(`${config.apiUrl}/movies/tmdb/` + movie.id, requestOptionsPost)
          .then(handleResponse => {
            if (handleResponse.ok) {
              this.setState({
                favourite: !this.state.favourite
              })
            }
          })
          .then(movie => { });
      }
    }
    // DELETE
    else {
      fetch(`${config.apiUrl}/movies/` + movie.id + `/users/` + this.props.user._id, requestOptionsDelete)
        .then(handleResponse => {
          if (handleResponse.ok) {
            this.setState({
              favourite: !this.state.favourite
            })
          }
          console.log("handleResp: ", handleResponse);
        })
        .then(movie => { });
    }
  }

  render() {
    const { movie, user, index, poster, home, source } = this.props;
    console.log({movie})
    if (this.props.source == "OMDB") {
      return (
        <div>
        <div className="movieBox">
        {!home &&
        <span onClick={this.handleFavourite} className={this.state.favourite ? "glyphicon glyphicon-star" : "glyphicon glyphicon-star-empty"}></span>
          }<p className="movieTitle"><b>{movie.Title ? movie.Title : movie.Title}</b></p>
          <hr />
          <div className="movieFlex">
            <div><img src={movie.Poster} /></div>
            <div>
            
              <p><b>Released:</b> {movie.Year}</p>
            
              
            </div>
          </div>
        </div>
      </div>
      );
    }
    return (
      <div>
        <div className="movieBox">
        {!home &&
        <span onClick={this.handleFavourite} className={this.state.favourite ? "glyphicon glyphicon-star" : "glyphicon glyphicon-star-empty"}></span>
          }<p className="movieTitle"><b>{movie.name ? movie.name : movie.title}</b></p>
          <hr />
          <div className="movieFlex">
            <div><img src={poster ? poster : (movie.cover ? movie.cover : movie.poster_path)} /></div>
            <div>
              <p>{movie.description ? movie.description : movie.overview}</p>
              <p><b>Genres:</b> {movie.genre.join(", ")}</p>
              <p><b>Released:</b> {home ? movie.released : movie.release_date}</p>
              {movie.social_data == undefined &&
              <p><b>Rating:</b> {home ? movie.rating : (movie.vote_average ? movie.vote_average : (movie.fan_count ? movie.fan_count + " (fan count)" : (movie.social_data ?
                movie.social_data.tmdb_vote_average : "unknown")))}</p> 
              }
                {movie.social_data &&
            <div>
              {movie.social_data.tmdb_vote_average &&
              <p><b>Rating:</b> {home ? movie.rating : (movie.vote_average ? movie.vote_average : (movie.fan_count ? movie.fan_count + " (fan count)" : (movie.social_data ?
                movie.social_data.tmdb_vote_average : "unknown")))}</p> 
              }
              {movie.social_data.tmdb_vote_count &&
              <p><b>Voters:</b> {movie.social_data.tmdb_vote_count}</p> 
              }
              {movie.social_data.fb_fan_count &&
              <p><b>Number of likes:</b> {movie.social_data.fb_fan_count}</p> 
              }
                {movie.social_data.omdb_rating &&
              <p><b>IMDB Rating:</b> {movie.social_data.omdb_rating}</p> 
                }
                {movie.social_data.omdb_rating &&
              <p><b>Voters:</b> {movie.social_data.omdb_vote_count}</p> 
            }
            </div>
                }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser, fetchUserAction: fetchUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovieEntry));
