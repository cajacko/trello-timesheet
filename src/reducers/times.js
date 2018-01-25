import cloneDeep from 'lodash/fp/cloneDeep';
import getTimeIdFromCardIdDateString from 'src/helpers/getTimeIdFromCardIdDateString';

const defaultState = {
  times: {},
  datesByCard: {},
  cardsByDate: {},
  changes: {
    times: {},
    datesByCard: {},
    cardsByDate: {},
  },
};

function setTimes(state, timeId, cardId, dateString, value) {
  const newState = cloneDeep(state);

  newState.times[timeId] = value;

  if (!newState.datesByCard[cardId]) newState.datesByCard[cardId] = {};
  if (!newState.cardsByDate[dateString]) newState.cardsByDate[dateString] = {};

  newState.datesByCard[cardId][dateString] = true;
  newState.cardsByDate[dateString][cardId] = true;

  return newState;
}

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'SET_TIME': {
      const { props, value } = payload;
      const { timeId, cardId, dateString } = props;

      return setTimes(state, timeId, cardId, dateString, value);
    }

    case 'SET_CHANGED_TIME': {
      const newState = cloneDeep(state);
      const { value, cardId, dateString } = payload;
      const timeId = getTimeIdFromCardIdDateString(cardId, dateString);

      newState.changes = setTimes(
        newState.changes,
        timeId,
        cardId,
        dateString,
        value,
      );

      return newState;
    }

    case 'SAVE_CHANGES_SUCCEEDED': {
      const newState = cloneDeep(state);
      newState.changes = defaultState.changes;

      // TODO: merge payload.changes into newState

      return newState;
    }

    default:
      return state;
  }
};
