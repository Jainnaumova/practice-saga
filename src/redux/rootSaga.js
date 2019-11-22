import "regenerator-runtime/runtime";
import { spawn } from "redux-saga/effects";
import createCatSaga from "./catSaga";

function* rootSaga() {
  const { watchFetchCatFactSaga } = createCatSaga();

  yield spawn(watchFetchCatFactSaga);

  const { watchFetchDogFactSaga } = createDogSaga();

  yield spawn(watchFetchDogFactSaga);
}

export default rootSaga;
