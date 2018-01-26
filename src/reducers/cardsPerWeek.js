import cloneDeep from 'lodash/fp/cloneDeep';
import getDateStringFromDate from 'src/helpers/getDateStringFromDate';

export default (state = {}, { type, payload }) => {
  switch (type) {
    case 'GET_SUGGESTIONS_SUCCEEDED': {
      const newState = cloneDeep(state);
      const dateString = getDateStringFromDate(payload.date);

      newState[dateString] = payload.suggestions.map(({ id }) => id);

      return newState;
    }

    default:
      return state;
  }
};
