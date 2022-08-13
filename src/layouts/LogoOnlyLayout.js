import { Outlet } from 'react-router-dom';
import { Card, Link, Container, Typography } from '@mui/material';

// material
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';
import oneapi from '../assets/oneapi.png';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
      <HeaderStyle>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <img src={oneapi} alt="photoURL" style={{ width: 80 }} />

          <Typography variant="h4" sx={{ mt: 5, mb: 5 }} style={{ fontFamily: 'Bebas Neue, cursive' }}>
            One <span style={{ color: '#1877F2' }}>API</span>
          </Typography>
        </div>
      </HeaderStyle>
      <Outlet />
    </>
  );
}
