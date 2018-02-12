import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AddTime from '../AddTime';
import PrivateRoute from '../PrivateRoute';
import Auth from '../Auth';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={() => <div />} />
      <PrivateRoute path="/add-time" component={AddTime} />
      <Route exact path="/auth/:stage" component={Auth} />
    </div>
  </Router>
);

export default App;
