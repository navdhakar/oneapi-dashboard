import { UNIFY_URI } from '../config';

export const makePostRequest = async (UrlPath, data) => {
  const response = await fetch(`${UNIFY_URI}${UrlPath}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    body: JSON.stringify(data),
    // no-cors, *cors, same-origin
    cache: 'no-cache',
    credentials: 'same-origin', // *default, no-cache, reload, force-cache, only-if-cached
    // include, *same-origin, omit
    headers: {
      'X-Parse-Application-Id': data.name,
      'Content-Type': 'application/json',

      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body data type must match "Content-Type" header
  });
  console.log(response);
  return response.json();
};
export const makeGETRequest = async (UrlPath) => {
  const response = await fetch(`${UNIFY_URI}${UrlPath}`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-origin
    cache: 'no-cache',
    credentials: 'same-origin', // *default, no-cache, reload, force-cache, only-if-cached
    // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body data type must match "Content-Type" header
  });
  console.log(response);
  return response.json();
};
