export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_EMAIL = 'SET_USER_EMAIL';
export const SET_USER_PHOTO = 'SET_USER_PHOTO';
export const SET_USER_JWT_TOKEN = 'SET_USER_JWT_TOKEN';
export const SET_USER_DATABASES = 'SET_USER_DATABASES';
export const SET_USER_AUTH_INFO = 'SET_USER_AUTH_INFO';
export const SET_PAY_URL_TOKEN = 'SET_PAY_URL_TOKEN';
export const SET_CUSTOM_API = 'SET_CUSTOM_API';

export const setName = (name) => (dispatch) => {
  dispatch({
    type: SET_USER_NAME,
    payload: name,
  });
};

export const setEmail = (email) => (dispatch) => {
  dispatch({
    type: SET_USER_EMAIL,
    payload: email,
  });
};
export const setPhoto = (photo) => (dispatch) => {
  dispatch({
    type: SET_USER_PHOTO,
    payload: photo,
  });
};
export const setJwtToken = (jwttoken) => (dispatch) => {
  dispatch({
    type: SET_USER_JWT_TOKEN,
    payload: jwttoken,
  });
};
export const setuserDatabases = (userdatabases) => (dispatch) => {
  dispatch({
    type: SET_USER_DATABASES,
    payload: userdatabases,
  });
};
export const setuserAuthInfo = (userauthinfo) => (dispatch) => {
  dispatch({
    type: SET_USER_AUTH_INFO,
    payload: userauthinfo,
  });
};
export const seturlToken = (urltoken) => (dispatch) => {
  dispatch({
    type: SET_PAY_URL_TOKEN,
    payload: urltoken,
  });
};
export const setcustomapi = (customapi) => (dispatch) => {
  dispatch({
    type: SET_CUSTOM_API,
    payload: customapi,
  });
};
