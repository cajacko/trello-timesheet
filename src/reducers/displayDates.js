import getDateStringFromDate from 'src/helpers/getDateStringFromDate';
import getAllDatesFromStart from 'src/helpers/getAllDatesFromStart';

const date = new Date();

while (date.getDay() !== 1) {
  date.setDate(date.getDate() - 1);
}

const defaultState = getAllDatesFromStart(date);

export default (state = defaultState, { type }) => {
  switch (type) {
    case 'PREVIOUS_WEEK': {
      const date = new Date(state[0].date);
      date.setDate(date.getDate() - 7);

      return getAllDatesFromStart(date);
    }

    case 'NEXT_WEEK': {
      const date = new Date(state[0].date);
      date.setDate(date.getDate() + 7);

      return getAllDatesFromStart(date);
    }

    default:
      return state;
  }
};
