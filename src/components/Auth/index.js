import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Timely from '../../modules/Timely';
import parseQueryString from '../../helpers/parseQueryString';
import Trello from '../../modules/Trello';

class Auth extends PureComponent {
  constructor(props) {
    super(props);

    const { code } = parseQueryString(this.props.location.search);

    this.state = {
      authUrl: Timely.getOAuthCodeUrl(),
      code,
      value: '',
      loading: !!code,
      token: null,
      error: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.state.code) {
      Timely.getOAuthToken(this.state.code)
        .then(token => this.setState({ token, loading: false }))
        .catch(error => {
          console.error(error);
          this.setState({ error: true, loading: false });
        });
    }
  }

  onSubmit(event) {
    event.preventDefault();

    Trello.setData('access_token', this.state.value)
      .then(() => {
        this.props.history.push('/add-time');
        window.location.reload();
      })
      .catch(console.error);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    if (this.state.loading) return <p>Loading</p>;
    if (this.state.token) return <p>{this.state.token}</p>;
    if (this.state.error) return <p>Error, check logs</p>;

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
