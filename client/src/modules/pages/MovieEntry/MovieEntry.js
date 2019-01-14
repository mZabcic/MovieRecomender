import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser, getUser } from "modules/redux";
import { handleResponse, requestOptions } from "../../services/networking";
import config from 'config/default.json';

class MovieEntry extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    }

  }

  componentDidMount() {

  }

  render() {
    const { movie } = this.props;
    return (
      <a href={movie.homepage}>
        <div>
          <p><b>{movie.name}</b></p>
          <hr />
          <div>
            <div><img src={movie.cover} /></div>
            <div>
              <p>{movie.overview}</p>
              <p><b>Released:</b> {movie.release_date}</p>
              <p><b>Rating:</b> {movie.fan_count}</p>
            </div>
          </div>
        </div>
      </a>
    );
  }
}


function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MovieEntry));
