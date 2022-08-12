import { SET_USER_NAME, SET_USER_EMAIL, SET_USER_PHOTO, SET_USER_JWT_TOKEN, SET_USER_DATABASES } from './action';

const initialState = {
  name: null,
  email: null,
  userdatabases: null,
};

const authReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, name: action.payload };
    case SET_USER_EMAIL:
      return { ...state, email: action.payload };
    case SET_USER_PHOTO:
      return { ...state, photo: action.payload };
    case SET_USER_JWT_TOKEN:
      return { ...state, jwttoken: action.payload };
    case SET_USER_DATABASES:
      return { ...state, userdatabases: action.payload };
    default:
      return state;
  }
};

export default authReducer;
