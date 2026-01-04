import Homepage from '../pages/Homepage';
import ViewAllOfficials from '../pages/ViewAllOfficials';
import BrgyOfficialProfile from '../pages/BrgyOfficialProfile';
import AboutUs from '../pages/AboutUs';
import Contacts from '../pages/Contacts';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PSACensusForm from '../pages/PSACensusForm';
import NotFoundPage from '../pages/NotFoundPage';

const publicRoutesConfig = [
  { path: '/', element: <Homepage /> },
  { path: '/viewAllOfficials', element: <ViewAllOfficials /> },
  { path: '/viewfficial/:id', element: <BrgyOfficialProfile /> },
  { path: '/psacensus', element: <PSACensusForm /> },
  { path: '/aboutUs', element: <AboutUs /> },
  { path: '/contacts', element: <Contacts /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/unauthorized', element: <NotFoundPage /> },
];

export default publicRoutesConfig;