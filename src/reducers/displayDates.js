import getDateStringFromDate from 'src/helpers/getDateStringFromDate';
import getAllDatesFromStart from 'src/helpers/getAllDatesFromStart';

const date = new Date();
date.setDate(date.getDate() - 6);

const defaultState = getAllDatesFromStart(date);

export default (state = defaultState, { type }) => {
  switch (type) {
    default:
      return state;
  }
};
