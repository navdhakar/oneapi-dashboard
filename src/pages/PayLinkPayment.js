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
const SectionStylesec = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(0, 0, 0, 0),
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

export default function AutoLinkPayment() {
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [ProductName, setProductName] = useState('');
  const [ProductImage, setProductImage] = useState('');
  const [ProductDescription, setProductDescription] = useState('');

  const [Amount, setAmount] = useState(0);

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  useEffect(() => {
    const url = window.location.href.split('/');
    const lastSegment = url.pop() || url.pop();
    makeGETRequest(`/unify/paymentservices/reciever/${lastSegment}`).then((res) => {
      console.log(res);
      setName(res.name);
      setEmail(res.email);
      setProductName(res.productname);
      setAmount(res.amount);
      setProductImage(res.productimage);
      setProductDescription(res.productdescription);
    });
  });
  return (
    <Page title="PayLinkPayments">
      <RootStyle>
        <HeaderStyle>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <img src={autolink} alt="photoURL" style={{ width: 70 }} />

            <Typography variant="h3" sx={{ mt: 5, mb: 5 }} style={{ fontFamily: 'Bebas Neue, cursive' }}>
              <span style={{ color: '#0a2441' }}>Pay</span>
              <span style={{ color: '#2681f8' }}>Link</span>
            </Typography>
          </div>
          {mdUp && (
            <Typography variant="body2" sx={{ mt: 5 }}>
              AutoLink powered by {''}
              <Link variant="subtitle2" href="https://app.nocodepayments.dev/">
                OneAPI
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h4" sx={{ px: 5, mt: 5, mb: 5 }}>
              Buy <span style={{ color: '#2681f8' }}>{ProductName}</span> now at ${Amount}.
            </Typography>
            <img alt="register" src={ProductImage} style={{ borderRadius: '20px', padding: '10px' }} />
            <Typography variant="body" sx={{ px: 5, mt: 5, mb: 5 }}>
              {ProductDescription}
            </Typography>
          </SectionStyle>
        )}
        <Container>
          <ContentStyle>
            {!mdUp && (
              <SectionStylesec>
                <Typography variant="h4" sx={{ px: 5, mt: 5, mb: 5 }}>
                  Buy <span style={{ color: '#2681f8' }}>{ProductName}</span> now at ${Amount}.
                </Typography>
                <img alt="register" src={ProductImage} style={{ borderRadius: '20px', padding: '10px' }} />
                <Typography variant="body" sx={{ px: 5, mt: 5, mb: 5 }}>
                  {ProductDescription}
                </Typography>
              </SectionStylesec>
            )}
            <Typography variant="h4" gutterBottom>
              Payment to <span style={{ color: '#2681f8' }}>{Name}</span> for{' '}
              <span style={{ color: '#2681f8' }}>{ProductName}</span>
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>{Email}</Typography>
            <OnePayment />
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By paying, I agree to PayLink&nbsp;
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
