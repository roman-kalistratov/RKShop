import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import store from './redux/store';
// import { PersistGate } from "redux-persist/integration/react";
import "./styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.Fragment>
    <Provider store={store}>
      {/* <PersistGate loading={"loading"} persistor={persistor}> */}
        <App />
      {/* </PersistGate> */}
    </Provider>
  </React.Fragment>
);
