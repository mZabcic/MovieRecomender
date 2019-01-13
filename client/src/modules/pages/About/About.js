import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser } from "modules/redux";

class About extends PureComponent {
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
        title="MovieMonster - About"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}>
        <div>
          <p>Ivan Ivkošić</p>
          <p>Lorem ipsum dolor sit amet, persius iuvaret per ut, est an dolores repudiare tincidunt. Cu est insolens phaedrum antiopam, pri cu viderer menandri, duo te clita numquam. Eum te quem deserunt, lorem exerci et pri. Vis eu offendit definitiones. In errem essent mel.</p>
          <p>ivan.ivkosic@fer.hr</p>
        </div>
        <div>
          <p>Ante Bundović</p>
          <p>Ante is 23 year old guy from Bjelovar city. He is a senior year student at FER, University of Zagreb. He mostly codes in .Net and React, is a football referee and would like to have a dog one day, a German shepard.</p>
          <p>ante.bundovic@fer.hr</p>
        </div>
        <div>
          <p>Mislav Žabčić</p>
          <p>Lorem ipsum dolor sit amet, persius iuvaret per ut, est an dolores repudiare tincidunt. Cu est insolens phaedrum antiopam, pri cu viderer menandri, duo te clita numquam. Eum te quem deserunt, lorem exerci et pri. Vis eu offendit definitiones. In errem essent mel.</p>
          <p>mislav.zabcic@fer.hr</p>
        </div>
        <div>
          <p>Juraj Pejnović</p>
          <p>Juraj is a 23 year old guy from Sisak, Croatia. Currently he is studying Software Engineering at Fer, University of Zagreb. His main interests are C, C++, Java, Javascript, C#, Arduino C, Project Managment, Public speaking. in his free time he loves dancing, boxing and listening to audiobooks. He is member of BEST (Board of European Students of Technology) so he travels a lot all over Europe.</p>
          <p>juraj.pejnovic@fer.hr</p>
        </div>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return { user: getUser(state) };
}


const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(About));
