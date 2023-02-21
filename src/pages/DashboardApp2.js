import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { faker } from '@faker-js/faker';
import { set } from 'lodash';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Register from './Register';
import { UNIFY_URI } from '../config';
import {
  setName,
  setEmail,
  setPhoto,
  setJwtToken,
  setuserDatabases,
  setuserAuthInfo,
  seturlToken,
  setcustomapi,
} from '../redux/action';

import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  ApplicationPanel,
  AppTrafficBySite,
  Application,
  AppCurrentSubject,
  CodeSnippet,
  AuthPanel,
  APIFunctions,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const [applicationtype, setapplicationtype] = useState('Database');
  const [authState, setauthState] = useState(false);
  const navigate = useNavigate();

  const setApplication = (apptype) => {
    setapplicationtype(apptype);
  };
  const navigatetopayments = (apptype) => {
    navigate('/dashboard/paylink');
  };
  const [cookies, setCookie] = useCookies(['user']);

  const dispatch = useDispatch();
  const userObj = useSelector((state) => state.authReducer);

  console.log(cookies.jwtToken);

  const authstate = () => {
    if (cookies.jwtToken) {
      fetch(`${UNIFY_URI}/signup/register/current`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          authorization: cookies.jwtToken,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body data type must match "Content-Type" header
      })
        .then((res) => {
          console.log(res);
          if (res.status === 400) {
            navigate('/register');
          }
          return res.json();
        })
        .then((data) => {
          dispatch(setName(data.name));
          dispatch(setEmail(data.email));
          dispatch(setPhoto(data.photo));
          dispatch(setuserDatabases(data.databases));
          dispatch(setuserAuthInfo(data.auth));
          dispatch(seturlToken(data.URLToken));
          dispatch(setcustomapi(data.apifunctions));
        })
        .then(() => {
          setauthState(true);
          return true;
        })
        .catch((err) => {
          console.log('something did not work');
          console.log(err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  };
  const AppPanel = () => {
    if (applicationtype === 'Database') {
      return (
        <>
          <Grid item xs={12} md={6} lg={12}>
            <ApplicationPanel title={applicationtype} subheader="+ Create Database API" />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <CodeSnippet
              title={'Post Data'}
              subheader="api example to post and access your database."
              style={{ fontFamily: 'Roboto Mono, monospace' }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <CodeSnippet
              title={'Get Data'}
              subheader="api example to perform operations on your database."
              style={{ fontFamily: 'Roboto Mono, monospace' }}
            />
          </Grid>
        </>
      );
    }
    if (applicationtype === 'Authentication') {
      return (
        <>
          <Grid item xs={12} md={6} lg={12}>
            <AuthPanel title={applicationtype} subheader="+ Create OAuth API" />
          </Grid>
        </>
      );
    }
    if (applicationtype === 'API Functions') {
      return (
        <>
          <Grid item xs={12} md={6} lg={12}>
            <APIFunctions title={applicationtype} subheader="+ Create OAuth API" />
          </Grid>
        </>
      );
    }
  };
  useEffect(() => {
    setauthState(authstate());
  }, []);
  return authState ? (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create API's 🔗 Auth token
          <Typography variant="subtitle2" sx={{ wordWrap: 'break-word', width: '30rem' }}>
            {userObj.urltoken}
          </Typography>
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Application
              status={userObj.userdatabases ? 'Active' : 'Inactive'}
              name={'Database API'}
              apptype={'Database'}
              color="warning"
              icon={'ant-design:database-filled'}
              setApplication={setApplication}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Application
              status={userObj.customapi ? 'Active' : 'Inactive'}
              name={'API Functions'}
              apptype={'API Functions'}
              icon={'ph:function-bold'}
              setApplication={setApplication}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Application
              status={userObj.userauthinfo ? 'Active' : 'Inactive'}
              name={'OAuth API'}
              apptype={'Authentication'}
              color="error"
              icon={'carbon:two-factor-authentication'}
              setApplication={setApplication}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Application
              status={userObj.urltoken ? 'Active' : 'Inactive'}
              name={'Payments'}
              apptype={'Payments'}
              color="info"
              icon={'fluent:payment-28-filled'}
              setApplication={navigatetopayments}
            />
          </Grid>

          <AppPanel />

          {/* <Grid item xs={12} md={6} lg={4}>
              <AppCurrentVisits
                title="Current Visits"
                chartData={[
                  { label: 'America', value: 4344 },
                  { label: 'Asia', value: 5435 },
                  { label: 'Europe', value: 1443 },
                  { label: 'Africa', value: 4443 },
                ]}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.chart.blue[0],
                  theme.palette.chart.violet[0],
                  theme.palette.chart.yellow[0],
                ]}
              />
            </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="One Api"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  ) : null;
}
