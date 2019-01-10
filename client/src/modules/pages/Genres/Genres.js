import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Genres extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <div />;
  }
}


function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Genres));
