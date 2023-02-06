import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';

import { faker } from '@faker-js/faker';
import { set } from 'lodash';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button } from '@mui/material';
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
} from '../redux/action';
import { makeGETRequest } from '../Api/Apikit';

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
  AppWebsiteVisits,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function PaymentDashboard() {
  const theme = useTheme();
  const [applicationtype, setapplicationtype] = useState('Payments');
  const [authState, setauthState] = useState(false);
  const [ProductName, setProductName] = useState('');
  const [PaymentLink, setPaymentLink] = useState('');
  const [ProductTrans, setProductTrans] = useState([]);
  const [TotalPayment, setTotalPayment] = useState();
  const [refreshdata, setrefreshdata] = useState(false);

  const navigate = useNavigate();

  const setApplication = (apptype) => {
    setapplicationtype(apptype);
  };
  const [cookies, setCookie] = useCookies(['user']);

  const dispatch = useDispatch();

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
          if (res.status === 400) {
            navigate('/register');
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.URLToken);
          dispatch(setName(data.name));
          dispatch(setEmail(data.email));
          dispatch(setPhoto(data.photo));
          dispatch(setuserDatabases(data.databases));
          dispatch(setuserAuthInfo(data.auth));
          dispatch(seturlToken(data.URLToken));
        })
        .then(() => {
          setauthState(true);

          return true;
        })
        .catch((err) => {
          console.log('some thing bad');
          console.log(err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  };

  const Paylinkstart = () => {
    navigate('/paylink');
  };

  const AppPanel = () => {
    if (applicationtype === 'Database') {
      return (
        <ApplicationPanel
          title={applicationtype}
          subheader="+ Create Database"
          chartLabels={[
            '01/01/2003',
            '02/01/2003',
            '03/01/2003',
            '04/01/2003',
            '05/01/2003',
            '06/01/2003',
            '07/01/2003',
            '08/01/2003',
            '09/01/2003',
            '10/01/2003',
            '11/01/2003',
          ]}
          chartData={[
            {
              name: 'Team A',
              type: 'column',
              fill: 'solid',
              data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
            },
            {
              name: 'Team B',
              type: 'area',
              fill: 'gradient',
              data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
            },
            {
              name: 'Team C',
              type: 'line',
              fill: 'solid',
              data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
            },
          ]}
        />
      );
    }
    if (applicationtype === 'Authentication') {
      return (
        <AuthPanel
          title={applicationtype}
          subheader="+ Add Authentication"
          chartLabels={[
            '01/01/2003',
            '02/01/2003',
            '03/01/2003',
            '04/01/2003',
            '05/01/2003',
            '06/01/2003',
            '07/01/2003',
            '08/01/2003',
            '09/01/2003',
            '10/01/2003',
            '11/01/2003',
          ]}
          chartData={[
            {
              name: 'Team A',
              type: 'column',
              fill: 'solid',
              data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
            },
            {
              name: 'Team B',
              type: 'area',
              fill: 'gradient',
              data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
            },
            {
              name: 'Team C',
              type: 'line',
              fill: 'solid',
              data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
            },
          ]}
        />
      );
    }
  };

  const userObj = useSelector((state) => state.authReducer);
  console.log(userObj);
  const getpaymentdata = () => {
    makeGETRequest(`/unify/paymentservices/reciever/${userObj.urltoken}`)
      .then((res) => {
        setProductName(res.productname);
        setPaymentLink(res.paymentlink);
        setProductTrans(res.paymentslogs);
        setTotalPayment(res.dueamount);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(ProductTrans);
  };
  if (!ProductTrans) {
    getpaymentdata();
  }
  useEffect(() => {
    setauthState(authstate());
    getpaymentdata();
    console.log(userObj.urltoken);
  }, []);

  return authState ? (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add Payment To Your Product 💳
        </Typography>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <Application
              status="active"
              name={'Database'}
              color="warning"
              icon={'ant-design:database-filled'}
              setApplication={setApplication}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Application
              status="In development"
              name={'Storage'}
              icon={'clarity:storage-solid'}
              setApplication={setApplication}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Application
              status="active"
              name={'Authentication'}
              color="error"
              icon={'carbon:two-factor-authentication'}
              setApplication={setApplication}
            />
          </Grid> */}

          <Grid item xs={12} sm={6} md={3}>
            <Application
              status={userObj.urltoken ? 'Product' : 'Add Payment Now'}
              name={userObj.urltoken ? ProductName : 'Payments'}
              apptype={'Payments'}
              color="info"
              icon={'fa:product-hunt'}
              setApplication={setApplication}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppPanel />
          </Grid>

          {userObj.urltoken ? (
            <>
              <Grid item xs={12} md={6} lg={8}>
                <CodeSnippet
                  title={applicationtype}
                  subheader="Just embed this code in your Pricing table UI"
                  link={PaymentLink}
                  chartData={[
                    { label: 'Italy', value: 400 },
                    { label: 'Japan', value: 430 },
                    { label: 'China', value: 448 },
                    { label: 'Canada', value: 470 },
                    { label: 'France', value: 540 },
                    { label: 'Germany', value: 580 },
                    { label: 'South Korea', value: 690 },
                    { label: 'Netherlands', value: 1100 },
                    { label: 'United States', value: 1200 },
                    { label: 'United Kingdom', value: 1380 },
                  ]}
                  style={{ fontFamily: 'Roboto Mono, monospace' }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
                <AppWebsiteVisits
                  title={`Total Payment $${TotalPayment / 100} Recieved`}
                  subheader="Payment for current cycle"
                  chartLabels={ProductTrans ? ProductTrans.map((i) => i.timestamp) : ['none']}
                  chartData={[
                    {
                      name: ProductName,
                      type: 'column',
                      fill: 'solid',
                      data: ProductTrans ? ProductTrans.map((i) => i.transactionAmnt / 100) : [0],
                    },
                    // {
                    //   name: 'Team B',
                    //   type: 'area',
                    //   fill: 'gradient',
                    //   data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                    // },
                    // {
                    //   name: 'Team C',
                    //   type: 'line',
                    //   fill: 'solid',
                    //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                    // },
                  ]}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} md={6} lg={12}>
              <Button variant="contained" style={{ margin: 10 }} onClick={Paylinkstart}>
                Add
              </Button>
            </Grid>
          )}

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
