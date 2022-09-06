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
import { AutoLinkForm } from '../sections/auth/register';
import AuthSocial from '../sections/auth/AuthSocial';
import '../glob.css';
import autolink from '../assets/autolink.png';

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
    padding: theme.spacing(0, 5, 0, 7),
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

export default function Register() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="PayLink">
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
              AutoLink powered by {''}
              <Link variant="subtitle2" href="https://oneapiapp.vercel.app/">
                OneAPI
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h4" sx={{ px: 5, mt: 10, mb: 5 }}>
              Create payment link in one click{' '}
              <span style={{ color: '#00d36b', fontFamily: 'Roboto Mono, monospace' }}>and </span> trigger action when
              payment recieved.
            </Typography>
            <img alt="register" src="/static/illustrations/payment.jpg" />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Create Auto Triggered payment links.
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              As soon as your customer pays specific action will be triggered(if not indian leave Account/IFSC empty ).
            </Typography>

            <AutoLinkForm />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By registering, I agree to PayLink&nbsp;
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
                AutoLink is Built on top of OneAPI
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
