import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser, fetchUser } from "modules/redux";

class Profile extends PureComponent {
  constructor(props) {
    super(props);

    this.handleLogoutClick = this.handleLogoutClick.bind(this);

  }

  componentDidMount() {
    this.props.fetchUserAction();
  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  render() {
    const { user } = this.props;
    return (
      <Page
        title="MovieMonster - Profile"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>
        <ProfileCard user={this.props.user}/>
      </Page>
    );
  }
}

const ProfileCard = ({user}) => {
  console.log({user})
  const render = 
    <div className="moviesHomeSection">
      <div>Name: {user.first_name}</div>
      <div>Surname: {user.last_name}</div>
      <div>Email: {user.email}</div>
      <div>No of my movies: {user.movies ? user.movies.length : 0}</div>
    </div>;
  return render;
}

function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser, fetchUserAction: fetchUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
