import { CHANGE_INPUTFIELD } from "../constants/constants";

export const setInputURL = text => {
  return { type: CHANGE_INPUTFIELD, payload: text };
};
