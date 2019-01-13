import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser } from "modules/redux";

class Contact extends PureComponent {
  constructor(props) {
    super(props);

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

  }

  handleFormSubmit() {

  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  render() {
    const { user } = this.props;
    return (
      <Page
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>
        <div>
          <form onSubmit={this.handleFormSubmit}>
            <label>Subject</label>
            <input type="text" id="subject" name="subject" placeholder="Subject" />
            <label>E-mail</label>
            <input type="email" id="email" name="email" placeholder="E-mail" />
            <label>Message</label>
            <textarea type="text" id="body" name="body" placeholder="Your message..." />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return { user: getUser(state) };
}

const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Contact));
