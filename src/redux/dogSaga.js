import { put, takeEvery } from "redux-saga/effects";
import { ADD_CAT_FACT, RECEIVE_CAT_FACT } from "./actions";
import { fetchCatFact } from "../util/utilFunctions";

function createCatSaga() {
  function* fetchCatFactSaga() {
    const res = yield fetchCatFact();
    const fact = yield res.json();

    yield put({
      type: RECEIVE_CAT_FACT,
      payload: fact
    });
  }

  function* watchFetchCatFactSaga() {
    yield takeEvery([ADD_CAT_FACT], fetchCatFactSaga);
  }

  return {
    watchFetchCatFactSaga
  };
}

export default createCatSaga;
