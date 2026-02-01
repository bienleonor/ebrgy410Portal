import Homepage from '../pages/Homepage';
import AboutUs from '../pages/AboutUs';
import Contacts from '../pages/Contacts';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PSACensusForm from '../pages/PSACensusForm';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ForbiddenPage from '../pages/ForbiddenPage';
import BadRequestPage from '../pages/BadRequestPage';
import RequestTimeoutPage from '../pages/RequestTimeoutPage';

const publicRoutesConfig = [
  { path: '/', element: <Homepage /> },
  { path: '/psacensus', element: <PSACensusForm /> },
  { path: '/aboutUs', element: <AboutUs /> },
  { path: '/contacts', element: <Contacts /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/401', element: <UnauthorizedPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/400', element: <BadRequestPage /> },
  { path: '/408', element: <RequestTimeoutPage /> },
];

export default publicRoutesConfig;