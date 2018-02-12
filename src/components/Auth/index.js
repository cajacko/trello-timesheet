import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Timely from '../../modules/Timely';
import parseQueryString from '../../helpers/parseQueryString';

class Auth extends PureComponent {
  componentWillMount() {
    let callback;
    switch (this.props.match.params.stage) {
      case 'get-oauth-code':
        callback = Timely.getOAuthCode;
        break;

      case 'callback':
        callback = Timely.gotOAuthCode;
        break;

      default:
        throw new Error('Undefined stage in auth');
    }

    callback(parseQueryString(this.props.location.search));
  }

  render() {
    return <div />;
  }
}

export default withRouter(Auth);
