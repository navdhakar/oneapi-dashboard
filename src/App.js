import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import ReactGa from 'react-ga';
import { set } from 'lodash';
// routes
import Register from './pages/Register';
import Login from './pages/Login';

import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { setName, setEmail, setPhoto, setJwtToken } from './redux/action';

import { UNIFY_URI } from './config';
// ----------------------------------------------------------------------

export default function App() {
  useEffect(() => {
    console.log('app');
    ReactGa.initialize('UA-214532842-2');
    ReactGa.pageview(window.location.pathname + window.location.search);
  }, []);
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
