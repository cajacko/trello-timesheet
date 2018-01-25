import cloneDeep from 'lodash/fp/cloneDeep';

export function setTimes(state, timeId, cardId, dateString, value) {
  const newState = cloneDeep(state);

  newState.times[timeId] = parseInt(value, 10);

  if (!newState.datesByCard[cardId]) newState.datesByCard[cardId] = {};
  if (!newState.cardsByDate[dateString]) newState.cardsByDate[dateString] = {};

  newState.datesByCard[cardId][dateString] = true;
  newState.cardsByDate[dateString][cardId] = true;

  return newState;
}

export function removeTimes(state, timeId, cardId, dateString) {
  const newState = cloneDeep(state);

  if (newState.times[timeId]) delete newState.times[timeId];

  if (newState.datesByCard[cardId]) {
    if (newState.datesByCard[cardId][dateString])
      delete newState.datesByCard[cardId][dateString];
  }

  if (newState.cardsByDate[dateString]) {
    if (newState.cardsByDate[dateString][cardId])
      delete newState.cardsByDate[dateString][cardId];
  }

  return newState;
}
