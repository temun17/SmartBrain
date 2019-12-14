import { CHANGE_INPUTFIELD } from "../constants/constants";

const initialStateSearch = {
  input: ""
};

export const inputURL = (state = initialStateSearch, action = {}) => {
  console.log(action.type);
  switch (action.type) {
    case CHANGE_INPUTFIELD:
      return { ...state, input: action.payload };
    default:
      return state;
  }
};
