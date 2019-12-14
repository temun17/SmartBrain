import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "tachyons";
import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

import { inputURL } from "./reducers/reducers";
import "./containers/App.css";

const logger = createLogger();

const store = createStore(inputURL, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();
