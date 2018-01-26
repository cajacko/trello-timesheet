import cloneDeep from 'lodash/fp/cloneDeep';

export default (state = [], { type, payload }) => {
  switch (type) {
    case 'ADD_CARD_SUCCEEDED': {
      if (state.includes(payload.id)) return state;

      const newState = state.slice();

      newState.push(payload.id);

      return newState;
    }

    default:
      return state;
  }
};
