import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { Page } from "modules/components";
import { loginUser } from "modules/redux";
import config from "config/default.json";
import { images } from "assets/images";
import "./Login.css";

class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.handleFacebook = this.handleFacebook.bind(this);
  }

  handleFacebook(response) {
    const { loginUserAction } = this.props;
    loginUserAction(response.accessToken, response.id);
  }

  render() {

    if (localStorage.getItem('user')) {
      return <Redirect to={{ pathname: '/' }} />;
    }



    return (
      <Page>
        <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
          <form
            className="login100-form validate-form flex-sb flex-w"
          >
            <img src={images.logo} className="mmonster" alt="Movie Monster logo" />
            <span className="login100-form-title p-b-53">
              Welcome to <b>M</b>ovie<b>M</b>onster
			    </span>
            <p className="singin">Sing in with</p>
            <FacebookLogin appId={config.facebook.AppID}
              autoLoad
              callback={this.handleFacebook}
              cssClass="btn-face m-b-20 position--center" />
          </form>
        </div>
      </Page >
    );
  }
}


function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = { loginUserAction: loginUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
