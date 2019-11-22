import { combineReducers } from "redux";
import catReducer from "./catReducer";
// import dogReducer from "./dogReducer";
// import todoReducer from "./todoReducer";

const rootReducer = combineReducers({
  catReducer,
  dogReducer
});

export default rootReducer;
