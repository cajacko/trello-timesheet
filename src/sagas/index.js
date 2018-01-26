import { call, put, takeEvery } from 'redux-saga/effects';
import { cards } from 'src/helpers/modules';
import store from 'src/store';

function* getSuggestions({ payload }) {
  try {
    const suggestions = yield call(cards.getSuggestions, payload);
    yield put({
      type: 'GET_SUGGESTIONS_SUCCEEDED',
      payload: { suggestions, date: payload },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: 'GET_SUGGESTIONS_FAILED',
      payload: { error, date: payload },
    });
  }
}

function* saveChanges() {
  try {
    const { changes } = store.getState().times;
    const suggestions = yield call(cards.saveChanges, changes);
    yield put({ type: 'SAVE_CHANGES_SUCCEEDED', payload: changes });
  } catch (e) {
    console.error(e);
    yield put({ type: 'SAVE_CHANGES_FAILED', payload: e });
  }
}

function* updateTrello() {
  try {
    yield call(cards.updateCardsInDatabase);
    yield put({
      type: 'UPDATE_TRELLO_SUCCEEDED',
    });
  } catch (e) {
    console.error(e);
    yield put({ type: 'UPDATE_TRELLO_FAILED', payload: e });
  }
}

function* addCard({ payload }) {
  try {
    const card = yield call(cards.getCard, payload);
    yield put({
      type: 'ADD_CARD_SUCCEEDED',
      payload: card,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: 'ADD_CARD_FAILED',
      payload: e,
    });
  }
}

function* sagas() {
  yield takeEvery('GET_SUGGESTIONS_REQUESTED', getSuggestions);
  yield takeEvery('SAVE_CHANGES_REQUESTED', saveChanges);
  yield takeEvery('UPDATE_TRELLO_REQUESTED', updateTrello);
  yield takeEvery('ADD_CARD_REQUESTED', addCard);
}

export default sagas;
