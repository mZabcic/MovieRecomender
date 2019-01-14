import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser } from "modules/redux";

class Contact extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      subject: "",
      message: ""
    }

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  handleNameChange(event) {
    const { value } = event.target;
    this.setState({ name: value });
  }

  handleEmailChange(event) {
    const { value } = event.target;
    this.setState({ email: value });
  }

  handleSubjectChange(event) {
    const { value } = event.target;
    this.setState({ subject: value });
  }

  handleMessageChange(event) {
    const { value } = event.target;
    this.setState({ message: value });
  }

  render() {
    const { user } = this.props;
    return (
      <Page
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>
        <div className="contact-container">
          <div className="form-area">
            <h3>Contact us</h3>
            <hr />
            <div className="form-group">
              <input type="text" className="form-control" id="name" name="name" placeholder="Name and surname" required onChange={this.handleNameChange} />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" id="email" name="email" placeholder="E-mail" required onChange={this.handleEmailChange} />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" id="subject" name="subject" placeholder="Subject" required onChange={this.handleSubjectChange} />
            </div>
            <div className="form-group">
              <textarea className="form-control" type="textarea" id="message" placeholder="Your message" maxlength="280" rows="7" onChange={this.handleMessageChange}></textarea>
            </div>
            <a href={`mailto:dm@fer.hr`} id="submit" name="submit" className="btn btn-primary ">Submit</a>
          </div>
          <div class="gap"></div>
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
