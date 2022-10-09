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
import autolink from '../assets/oneapi.png';

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
    padding: theme.spacing(0, 2, 0, 4),
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
  alignItems: 'center',
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
              <span style={{ color: '#0a2441' }}>Pay</span>
              <span style={{ color: '#2681f8' }}>Link</span>
            </Typography>
          </div>
          {smUp && (
            <Typography variant="body2" sx={{ mt: 5 }}>
              Payments powered by {''}
              <Link variant="subtitle2" href="https://app.nocodepayments.dev/register">
                PayLink
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Payment <span style={{ color: '#2681f8' }}>complete</span>
            </Typography>
            <img alt="register" src="/static/illustrations/payment.png" />
          </SectionStyle>
        )}
        <Container>
          <ContentStyle>
            <img alt="register" src="/static/illustrations/transaction_complete.png" style={{ width: '350px' }} />

            <Typography variant="h4" gutterBottom>
              Thanks, <span style={{ color: '#2681f8' }}>{Name}</span> your Payment was successfull.
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 2 }}>{Email}</Typography>

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 0 }}>
              I agree to PayLink&nbsp;
              <Link underline="always" color="text.primary" href="https://plink.vercel.app/termsofuse.html">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link underline="always" color="text.primary" href="https://plink.vercel.app/privacypolicy.html">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link underline="always" color="text.primary" href="https://plink.vercel.app/merchantagreement.html">
                Merchant Agreement
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
