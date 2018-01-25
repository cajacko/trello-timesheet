import cloneDeep from 'lodash/fp/cloneDeep';
import getDateStringFromDate from 'src/helpers/getDateStringFromDate';

const defaultState = {
  init: 'REQUESTED',
  trello: null,
  suggestions: {},
  saving: null,
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'UPDATE_TRELLO_REQUESTED': {
      const newState = cloneDeep(state);
      newState.trello = 'REQUESTED';
      return newState;
    }

    case 'UPDATE_TRELLO_SUCCEEDED': {
      const newState = cloneDeep(state);
      newState.trello = 'SUCCEEDED';
      newState.init = 'SUCCEEDED';
      return newState;
    }

    case 'UPDATE_TRELLO_FAILED': {
      const newState = cloneDeep(state);
      newState.trello = 'FAILED';
      return newState;
    }

    case 'SAVE_CHANGES_REQUESTED': {
      const newState = cloneDeep(state);
      newState.saving = 'REQUESTED';
      return newState;
    }

    case 'SAVE_CHANGES_SUCCEEDED': {
      const newState = cloneDeep(state);
      newState.saving = 'SUCCEEDED';
      return newState;
    }

    case 'SAVE_CHANGES_FAILED': {
      const newState = cloneDeep(state);
      newState.saving = 'FAILED';
      return newState;
    }

    case 'GET_SUGGESTIONS_REQUESTED': {
      const newState = cloneDeep(state);
      const dateString = getDateStringFromDate(payload);
      newState.suggestions[dateString] = 'REQUESTED';
      return newState;
    }

    case 'GET_SUGGESTIONS_SUCCEEDED': {
      const newState = cloneDeep(state);
      const dateString = getDateStringFromDate(payload.date);
      newState.suggestions[dateString] = 'SUCCEEDED';
      return newState;
    }

    case 'GET_SUGGESTIONS_FAILED': {
      const newState = cloneDeep(state);
      const dateString = getDateStringFromDate(payload.date);
      newState.suggestions[dateString] = 'FAILED';
      return newState;
    }

    default:
      return state;
  }
};
