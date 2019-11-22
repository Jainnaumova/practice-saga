export const ADD_CAT_FACT = "ADD_CAT_FACT";
export const RECEIVE_CAT_FACT = "RECEIVE_CAT_FACT";
export const DELETE_CAT_FACT = "DELETE_CAT_FACT";

export const ADD_DOG_FACT = "ADD_DOG_FACT";
export const RECEIVE_DOG_FACT = "RECEIVE_DOG_FACT";
export const DELETE_DOG_FACT = "DELETE_DOG_FACT";

export function addCatFact() {
  return {
    type: ADD_CAT_FACT
  };
}

export function deleteCatFact(id) {
  return {
    type: DELETE_CAT_FACT,
    payload: id
  };
}

export function addDogFact() {
  return {
    type: ADD_DOG_FACT
  };
}

export function deleteDogFact(id) {
  return {
    type: DELETE_DOG_FACT,
    payload: id
  };
}
