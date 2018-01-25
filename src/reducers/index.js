import { combineReducers } from 'redux';
import cards from 'src/reducers/cards';
import times from 'src/reducers/times';
import cardsPerWeek from 'src/reducers/cardsPerWeek';
import displayDates from 'src/reducers/displayDates';
import status from 'src/reducers/status';

export default combineReducers({
  cards,
  times,
  cardsPerWeek,
  displayDates,
  status,
});
