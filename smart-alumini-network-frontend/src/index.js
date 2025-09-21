import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import tachyons from "tachyons";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { searchAlumini,networkProfiles,handleImageArray,handleChatUsers, chatBG } from "./components/redux/reducer";
import { searchChat, setUserJoin } from "./components/redux/reducer";
import { searchFiltered } from "./components/redux/reducer";
import { searchRoute } from "./components/redux/reducer";
import { calendarList } from "./components/redux/reducer";
import { emailDetails } from "./components/redux/reducer";
import { userNameDetails } from "./components/redux/reducer";
import { messageDetails } from "./components/redux/reducer";
import { messageList } from "./components/redux/reducer";
import { profileForAccount } from "./components/redux/reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistGate } from "redux-persist/integration/react";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "searchAlumini",
    "searchFiltered",
    "searchRoute",
    "searchChat",
    "emailDetails",
    "userNameDetails",
    "messageDetails",
    "messageList",
    "calendarList",
    "profileForAccount",
    "networkProfiles",
    "handleImageArray",
    "handleChatUsers",
    "setUserJoin",
    "chatBG"
  ],
};

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
const persistedState = loadFromLocalStorage();
const rootReducer = combineReducers({
  searchAlumini,
  searchFiltered,
  searchRoute,
  searchChat,
  emailDetails,
  userNameDetails,
  messageDetails,
  messageList,
  calendarList,
  profileForAccount,
  networkProfiles,
  handleImageArray,
  handleChatUsers,
  setUserJoin,
  chatBG
});
const store = createStore(
  rootReducer,
  persistedState,
  window._REDUX_DEVTOOLS_EXTENSION_ && window._REDUX_DEVTOOLS_EXTENSION_()
); //here searchRobots is a reducer so don't get confused the next time
store.subscribe(() => saveToLocalStorage(store.getState()));
// export default {store,persistor};
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
