import { database } from 'src/helpers/modules';
import store from 'src/store';

const { dispatch } = store;

function databaseDispatcher(ref, action, props) {
  return new Promise(resolve => {
    database.listenTo(ref, value => {
      dispatch({
        type: action,
        payload: { props, value },
      });

      resolve();
    });
  });
}

export default databaseDispatcher;
