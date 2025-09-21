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
  CALENDAR_EVENTS_LOAD,
  USER_JOINED,
  CHAT_BACKGROUND
} from "./constants.js";

const initialstate14 = {
  chatUsers: [],
};

export const handleChatUsers = (state = initialstate14, action = {}) => {
  switch (action.type) {
    case CHAT_USERS:{
      return Object.assign({}, state, { chatUsers: [...action.payload] });}
    default:
      return state;
  }
  
};

const initialstate13 = {
  imageArray: [],
};

export const handleImageArray = (state = initialstate13, action = {}) => {
  switch (action.type) {
    case IMAGE_ARRAY:{
      return Object.assign({}, state, { imageArray: [...action.payload] });}
    default:
      return state;
  }
  
};


const initialstate12 = {
  profileArray: "",
};

export const networkProfiles = (state = initialstate12, action = {}) => {
 
  switch (action.type) {
    case NETWORK_PROFILES:
      return Object.assign({}, state, { profileArray: action.payload });
    default:
      return state;
  }
  
};


const initialstate11 = {
  profileImage: "",
};

export const profileForAccount = (state = initialstate11, action = {}) => {
 
  switch (action.type) {
    case EVENT_PROFILE_IMAGE:
      return Object.assign({}, state, { profileImage: action.payload });
    default:
      return state;
  }
  
};


const initialstate = {
  aluminiSearch: "",
};

export const searchAlumini = (state = initialstate, action = {}) => {
 
  switch (action.type) {
    case CHANGE_ALUMINI_SEARCH:
      return Object.assign({}, state, { aluminiSearch: action.payload });
    default:
      return state;
  }
};

const initialstate2 = {
  filteredSearch: "",
};

export const searchFiltered = (state = initialstate2, action = {}) => {

  switch (action.type) {
    case CHANGE_FILTERED_SEARCH:
      return Object.assign({}, state, { filteredSearch: action.payload });
    default:
      return state;
  }
};

const initialstate3 = {
  routes: "",
};

export const searchRoute = (state = initialstate3, action = {}) => {

  switch (action.type) {
    case CHANGE_ROUTE:
      return Object.assign({}, state, { routes: action.payload });
    default:
      return state;
  }
};

const initialstate4 = {
  chatSearch: "",
};

export const searchChat = (state = initialstate4, action = {}) => {

  switch (action.type) {
    case CHANGE_CHAT_SEARCH:
      return Object.assign({}, state, { chatSearch: action.payload });
    default:
      return state;
  }
};

const initialstate10 = {
  click: 0,
};

export const searchClick = (state = initialstate10, action = {}) => {

  switch (action.type) {
    case CHANGE_CLICK:
      return Object.assign({}, state, { click: action.payload });
    default:
      return state;
  }
};

const initialstate5 = {
  emailCredentials: "",
};

export const emailDetails = (state = initialstate5, action = {}) => {

  switch (action.type) {
    case EMAIL_SIGNIN_CREDENTIALS:
      return Object.assign({}, state, { emailCredentials: action.payload });
    default:
      return state;
  }
};

const initialstate6 = {
  userNameCredentials: "",
};

export const userNameDetails = (state = initialstate6, action = {}) => {

  switch (action.type) {
    case USERNAME_SIGNIN_CREDENTIALS:
      return Object.assign({}, state, { userNameCredentials: action.payload });
    default:
      return state;
  }
};

const initialstate7 = {
  messageObject: "",
};

export const messageDetails = (state = initialstate7, action = {}) => {
  switch (action.type) {
    case MESSAGE_OBJECT:
      return Object.assign({}, state, { messageObject: action.payload });
    default:
      return state;
  }
};

const initialstate8 = {
  allMessages: "",
};

export const messageList = (state = initialstate8, action = {}) => {

  switch (action.type) {
    case MESSAGE_LIST:
      return Object.assign({}, state, { allMessages: action.payload });
    default:
      return state;
  }
};

const initialstate9 = {
  EVENTS_LOAD: "",
};

export const calendarList = (state = initialstate9, action = {}) => {

  switch (action.type) {
    case CALENDAR_EVENTS_LOAD:
      return Object.assign({}, state, { EVENTS_LOAD: action.payload });
    default:
      return state;
  }
};

const initialstate15 = {
  userJoined: -1,
};

export const setUserJoin = (state = initialstate15, action = {}) => {

  switch (action.type) {
    case USER_JOINED:
      return Object.assign({}, state, { userJoined: action.payload });
    default:
      return state;
  }
};

const initialstate16 = {
  chatBGImage: "",
};

export const chatBG = (state = initialstate16, action = {}) => {

  switch (action.type) {
    case CHAT_BACKGROUND:
      return Object.assign({}, state, { chatBGImage: action.payload });
    default:
      return state;
  }
};
