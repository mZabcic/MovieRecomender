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
        <div className="contact-container"> 
          <div className="form-area">  
            <form role="form"> 
                        <h3>KONTAKTIRAJTE NAS</h3>
                        <div className="form-group">
                            <input type="text" className="form-control" id="name" name="name" placeholder="Ime i prezime" required/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="email" name="email" placeholder="E-mail" required/>
                        </div> 
                        <div className="form-group">
                            <input type="text" className="form-control" id="subject" name="subject" placeholder="Predmet" required/>
                        </div>
                        <div className="form-group">
                        <textarea className="form-control" type="textarea" id="message" placeholder="Poruka" maxlength="280" rows="7"></textarea> </div>
                
            <button type="button" id="submit" name="submit" className="btn btn-primary ">POŠALJI</button>
            </form>
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
