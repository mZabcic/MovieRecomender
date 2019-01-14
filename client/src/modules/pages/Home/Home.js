import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import './Home.css';
import { Page } from 'modules/components';
import { logoutUser, getUser } from 'modules/redux';
import Form2 from "modules/components/Form2";
import Weather from "modules/components/Weather";
import HomeMovies from "modules/components/HomeMovies";

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.handleLogoutClick = this.handleLogoutClick.bind(this);

  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  render() {
    const { user } = this.props;
    return (
      <Page
        title="MovieMonster - Home"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}> 
      
      <table className="homeTable">
        <tr>
          <td ><HomeMovies/></td>
          <td><Weather/><Form2/></td>
        </tr>      
      </table> 
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
