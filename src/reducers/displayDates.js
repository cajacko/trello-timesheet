import getDateStringFromDate from 'src/helpers/getDateStringFromDate';
import getAllDatesFromStart from 'src/helpers/getAllDatesFromStart';

const date = new Date();

while (date.getDay() !== 1) {
  date.setDate(date.getDate() - 1);
}

const defaultState = getAllDatesFromStart(date);

export default (state = defaultState, { type }) => {
  switch (type) {
    default:
      return state;
  }
};
