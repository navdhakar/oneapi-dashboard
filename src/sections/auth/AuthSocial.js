import { useState } from 'react';
import { useCookies } from 'react-cookie';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from 'react-google-login';
import { useSelector, useDispatch } from 'react-redux';
import { Stack, Button, Divider, Typography } from '@mui/material';
import { setName, setEmail, setPhoto, setJwtToken, setuserDatabases } from '../../redux/action';
import Iconify from '../../components/Iconify';
import { UNIFY_URI } from '../../config';
// ----------------------------------------------------------------------
const clientId = '612470439960-9cr8dfia2v3hr89no7emec851rrt9sug.apps.googleusercontent.com';
export default function AuthSocial() {
  const obj = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jwtToken, setJwtTokenData] = useState(null);
  const [cookies, setCookie] = useCookies(['user']);
  const refreshTokenSetup = (res) => {
    // Timing to renew access token
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async () => {
      const newAuthRes = await res.reloadAuthResponse();
      refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
      console.log('newAuthRes:', newAuthRes);
      // saveUserToken(newAuthRes.access_token);  <-- save new token
      localStorage.setItem('authToken', newAuthRes.id_token);

      // Setup the other timer after the first one
      setTimeout(refreshToken, refreshTiming);
    };

    // Setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
  };

  const newUserCreate = (UserData, Response) => {
    fetch(`${UNIFY_URI}/signup/register/new_social_auth`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      body: JSON.stringify(UserData),
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
    })
      .then((res) => {
        if (res.status === 400) {
          navigate('/register');
        }
        return res.json();
      })
      .then((data) => {
        setCookie('jwtToken', data.token_data, { path: '/' });
        dispatch(setuserDatabases(data.databases));
      })
      .then(() => {
        dispatch(setName(UserData.name));
        dispatch(setEmail(UserData.email));
        dispatch(setPhoto(UserData.imageUrl));
      })
      .then(() => {
        refreshTokenSetup(Response);
        navigate('/dashboard/server');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onSuccess = (res) => {
    console.log('on success');
    const UserData = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      photo: res.profileObj.imageUrl,
      googleId: res.profileObj.googleId,
    };
    fetch(`${UNIFY_URI}/signup/register/login`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      body: JSON.stringify({ googleId: res.profileObj.googleId }),
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
    })
      .then((resp) => {
        console.log(resp.status);
        if (resp.status === 400) {
          newUserCreate(UserData, res);
        }
        return resp.json();
      })
      .then((data) => {
        setCookie('jwtToken', data.token_data, { path: '/' });
        dispatch(setuserDatabases(data.databases));
      })
      .then(() => {
        dispatch(setName(res.profileObj.name));
        dispatch(setEmail(res.profileObj.email));
        dispatch(setPhoto(res.profileObj.imageUrl));
      })
      .then(() => {
        refreshTokenSetup(res);
        navigate('/dashboard/server');
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(obj);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(`Failed to login. sit tight we will fix this`);
  };
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
  });
  return (
    <>
      <Stack direction="row">
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={signIn}>
          <Iconify icon="eva:google-fill" color="#1877F2" width={22} height={22} />
        </Button>
        {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button> */}
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
