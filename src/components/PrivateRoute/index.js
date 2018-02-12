import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Timely from '../../modules/Timely';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Timely.isAuthenticated() ? (
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

export default PrivateRoute;
