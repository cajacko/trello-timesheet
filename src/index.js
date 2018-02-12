import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Trello from './modules/Trello';

Trello.init();

ReactDOM.render(<App />, document.getElementById('root'));
