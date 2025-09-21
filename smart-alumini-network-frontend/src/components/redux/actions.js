import {
  CHANGE_ALUMINI_SEARCH,
  CHANGE_CHAT_SEARCH,
  CHANGE_FILTERED_SEARCH,
  CHANGE_ROUTE,
  CHANGE_CLICK,
  EMAIL_SIGNIN_CREDENTIALS,
  USERNAME_SIGNIN_CREDENTIALS,
  MESSAGE_OBJECT,
  MESSAGE_LIST,
  EVENTS_LOAD_CONST,
  EVENT_PROFILE_IMAGE,
  NETWORK_PROFILES,
  IMAGE_ARRAY,
  CHAT_USERS,
  USER_JOINED,
  CHAT_BACKGROUND
} from "./constants.js";


export const setChatUsers = (text) => {

  return {
    type: CHAT_USERS,
    payload: text,
  };
};

export const setImageArray = (text) => {

  return {
    type: IMAGE_ARRAY,
    payload: text,
  };
};

export const setProfileForAccount = (text) => {

  return {
    type: EVENT_PROFILE_IMAGE,
    payload: text,
  };
};

export const setNetworkProfiles = (text) => {

  return {
    type: NETWORK_PROFILES,
    payload: text,
  };
};

export const setAluminiSearch = (text) => {

  return {
    type: CHANGE_ALUMINI_SEARCH,
    payload: text,
  };
};

export const setChatSearch = (text) => {
  return {
    type: CHANGE_CHAT_SEARCH,
    payload: text,
  };
};

export const setClick = (text) => {
  return {
    type: CHANGE_CLICK,
    payload: text,
  };
};

export const setFilteredSearch = (text) => {
  return {
    type: CHANGE_FILTERED_SEARCH,
    payload: text,
  };
};

export const setRoute = (text) => {
  return {
    type: CHANGE_ROUTE,
    payload: text,
  };
};

export const setEmailCredentials = (text) => {
  return {
    type: EMAIL_SIGNIN_CREDENTIALS,
    payload: text,
  };
};

export const setUserNameCredentials = (text) => {
  return {
    type: USERNAME_SIGNIN_CREDENTIALS,
    payload: text,
  };
};

export const messageSearch = (text) => {
  return {
    type: MESSAGE_OBJECT,
    payload: text,
  };
};

export const messageList = (text) => {
  return {
    type: MESSAGE_OBJECT,
    payload: text,
  };
};

export const calendarEvents = (text) => {
  return {
    type: EVENTS_LOAD_CONST,
    payload: text,
  };
};

export const joinUser = (text) => {
  return {
    type: USER_JOINED,
    payload: text,
  };
};

export const setChatBackGround = (text) => {
  return {
    type: CHAT_BACKGROUND,
    payload: text,
  };
};
