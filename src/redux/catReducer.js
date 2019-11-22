import { RECEIVE_CAT_FACT, DELETE_CAT_FACT } from "./actions";

const defaultState = {
  catFacts: []
};

let index = 1;

function catReducer(state = defaultState, action) {
  let newFacts;

  switch (action.type) {
    case RECEIVE_CAT_FACT:
      newFacts = state.catFacts.slice();
      newFacts.push({ ...action.payload, id: index++ });
      return {
        ...state,
        catFacts: newFacts
      };
    case DELETE_CAT_FACT:
      newFacts = state.catFacts.slice().filter(fact => {
        return fact.id !== action.payload;
      });
      return {
        ...state,
        catFacts: newFacts
      };
    default:
      return state;
  }
}

export default catReducer;
