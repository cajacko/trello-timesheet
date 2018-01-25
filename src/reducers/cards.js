import cloneDeep from 'lodash/fp/cloneDeep';

export default (state = {}, { type, payload }) => {
  switch (type) {
    case 'GET_SUGGESTIONS_SUCCEEDED': {
      const newState = cloneDeep(state);

      payload.suggestions.forEach(card => {
        newState[card.id] = card;
      });

      return newState;
    }

    default:
      return state;
  }
};
