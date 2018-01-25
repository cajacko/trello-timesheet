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

    case 'SET_CARD': {
      const newState = cloneDeep(state);
      const { value } = payload;

      if (value) {
        newState[value.id] = value;
      }

      return newState;
    }

    case 'ADD_CARD_SUCCEEDED': {
      const newState = cloneDeep(state);
      newState[payload.id] = payload;
      return newState;
    }

    default:
      return state;
  }
};
