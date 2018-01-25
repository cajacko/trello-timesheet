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
    yield put({ type: 'GET_SUGGESTIONS_FAILED', payload: e });
  }
}

function* saveChanges() {
  try {
    const { changes } = store.getState().times;
    console.warn('saga', changes);
    const suggestions = yield call(cards.saveChanges, changes);
    yield put({ type: 'SAVE_CHANGES_SUCCEEDED', payload: changes });
  } catch (e) {
    console.error(e);
    yield put({ type: 'SAVE_CHANGES_FAILED', payload: e });
  }
}

function* sagas() {
  yield takeEvery('GET_SUGGESTIONS_REQUESTED', getSuggestions);
  yield takeEvery('SAVE_CHANGES_REQUESTED', saveChanges);
}

export default sagas;
