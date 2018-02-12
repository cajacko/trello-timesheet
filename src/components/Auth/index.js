import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Timely from '../../modules/Timely';
import parseQueryString from '../../helpers/parseQueryString';

class Auth extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      authUrl: Timely.getOAuthCodeUrl(),
      code: parseQueryString(this.props.location.search).code,
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    Timely.getOAuthToken(this.state.value).then(() =>
      this.props.history.push('/add-time'),
    );
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    if (this.state.code) {
      return <p>{this.state.code}</p>;
    }

    return (
      <form onSubmit={this.onSubmit}>
        <p>{this.state.authUrl}</p>

        <input
          type="text"
          placeholder="code"
          value={this.state.value}
          onChange={this.onChange}
        />
      </form>
    );
  }
}

export default withRouter(Auth);
