import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Timely from '../../modules/Timely';

class PrivateRoute extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { loading: true, isAuthenticated: false };
  }

  componentDidMount() {
    Timely.isAuthenticated()
      .then(this.setState({ loading: false, isAuthenticated: true }))
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, isAuthenticated: false });
      });
  }

  render() {
    if (this.state.loading) return <p>Loading</p>;

    const { component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          this.state.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/auth/get-oauth-code',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

export default PrivateRoute;
