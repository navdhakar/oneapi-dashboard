import { useState, useEffect } from 'react';

import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { OnePayment } from '../sections/auth/register';
import AuthSocial from '../sections/auth/AuthSocial';
import '../glob.css';
import autolink from '../assets/autolink.png';

import { makeGETRequest } from '../Api/Apikit';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function PaymentSuccess() {
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  useEffect(() => {
    const url = window.location.href.split('/');
    const lastSegment = url.pop() || url.pop();
    setName(lastSegment);
  });
  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <img src={autolink} alt="photoURL" style={{ width: 70 }} />

            <Typography variant="h3" sx={{ mt: 5, mb: 5 }} style={{ fontFamily: 'Bebas Neue, cursive' }}>
              <span style={{ color: '#118C4F' }}>Pay</span>
              <span style={{ color: '#00d36b' }}>Link</span>
            </Typography>
          </div>
          {smUp && (
            <Typography variant="body2" sx={{ mt: 5 }}>
              PayLink powered by {''}
              <Link variant="subtitle2" href="https://oneapiapp.vercel.app/">
                OneAPI
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              ✅Payment <span style={{ color: '#00d36b' }}>complete</span>
            </Typography>
            <img alt="register" src="/static/illustrations/payment.jpg" />
          </SectionStyle>
        )}
        <Container>
          <ContentStyle>
            <img alt="register" src="/static/illustrations/transaction_complete.jpg" />

            <Typography variant="h4" gutterBottom>
              ✅Hurray, <span style={{ color: '#00d36b' }}>{Name}</span> Payment successfull
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>{Email}</Typography>

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By paying, I agree to PayLink&nbsp;
              <Link underline="always" color="text.primary" href="#">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link underline="always" color="text.primary" href="#">
                Privacy Policy
              </Link>
              .
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Already have an account?{' '}
                <Link variant="subtitle2" to="/login" component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
