import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Page } from "modules/components";
import { logoutUser, getUser } from "modules/redux";
import { handleResponse, requestOptions } from "../../services/networking";
import config from 'config/default.json';

class About extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.requestCount = this.requestCount.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);

  }

  handleLogoutClick() {
    const { logoutUserAction } = this.props;
    logoutUserAction();
  }

  componentDidMount() {
    this.requestCount();
  }

  requestCount() {
    fetch(`${config.apiUrl}/movies/count`, requestOptions)
      .then(handleResponse)
      .then(movies => {
        this.setState({
          data: movies
        })
      });
  }

  render() {
    const { user } = this.props;
    let data = this.state.data;
    console.log(data);
    return (
      <Page
        title="MovieMonster - About"
        onLogoutClick={this.handleLogoutClick}
        loggedIn
        user={user}
        data={data}>
        <div className="profilesWrapper">
          <div className="profileBox">
            <p className="title">Statistics</p>
            <hr/>
            <p>In our database we have total of <strong>{data.total}</strong> movies.</p>
            <p>From The Internet Movie Database: <strong>{data.tmdb}</strong></p>
            <p>From The Open Movie Database: <strong>{data.omdb}</strong></p>
            <p>From Facebook: <strong>{data.fb}</strong></p>
          </div>
          <div className="profileBox">
            <p className="title">Ivan Ivkošić</p>
            <hr/>
            <p>Ivan is a 22 year old guy from Imotski. His mother tongue is Java but unfortunately due to occasions he is doing PHP and frontend things mostly for now. He wants to have a kangaroo one day.</p>
            <p>ivan.ivkosic@fer.hr</p>
          </div>
          <div className="profileBox">
            <p className="title">Ante Bundović</p>
            <hr/>
            <p>Ante is 23 year old guy from Bjelovar city. He is a senior year student at FER, University of Zagreb. He mostly codes in .Net and React, is a football referee and would like to have a dog one day, a German shepard.</p>
            <p>ante.bundovic@fer.hr</p>
          </div>
          <div className="profileBox">
            <p className="title">Mislav Žabčić</p>
            <hr/>
            <p>Mislav Žabčić was born in Zagreb but raised in Samobor. He is on his senior year of studies at FER, University of Zagreb. His main area of expertise is web site design and web app design. Languages he likes the most are PHP, JavaScript, TypeScript and his favorite frameworks are Laravel, Lumen, Angular and jQuerry.</p>
            <p>mislav.zabcic@fer.hr</p>
          </div>
          <div className="profileBox">
            <p className="title">Juraj Pejnović</p>
            <hr/>
            <p>Juraj is a 23 year old guy from Sisak, Croatia. Currently he is studying Software Engineering at Fer, University of Zagreb. His main interests are C, C++, Java, Javascript, C#, Arduino C, Project Managment, Public speaking. in his free time he loves dancing, boxing and listening to audiobooks. He is member of BEST (Board of European Students of Technology) so he travels a lot all over Europe.</p>
            <p>juraj.pejnovic@fer.hr</p>
          </div>
        </div>
        &nbsp;
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return { user: getUser(state) };
}


const mapDispatchToProps = { logoutUserAction: logoutUser };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(About));
