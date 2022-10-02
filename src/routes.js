import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import DashboardApp2 from './pages/DashboardApp2';
import PayLink from './pages/PayLink';
import PayLinkPayment from './pages/PayLinkPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentDashboard from './pages/PaymentDashboard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'server', element: <DashboardApp2 /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'paylink', element: <PaymentDashboard /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/paylink" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'paylink', element: <PayLink /> },
        { path: 'paylinkdashboard', element: <PaymentDashboard /> },

        { path: 'paylinkpayment/:urltoken', element: <PayLinkPayment /> },
        { path: 'paymentsuccess/:name', element: <PaymentSuccess /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
