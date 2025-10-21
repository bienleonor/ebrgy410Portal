import Homepage from '../pages/Homepage';
import ViewAllOfficials from '../pages/ViewAllOfficials';
import BrgyOfficialProfile from '../pages/BrgyOfficialProfile';
import AboutUs from '../pages/AboutUs';
import ResolutionOrdinance from '../pages/Resolution&Ordinance';
import Contacts from '../pages/Contacts';
import OnlineRequestingDocuments from '../pages/OnlineRequestingDocuments';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

const publicRoutesConfig = [
  { path: '/', element: <Homepage /> },
  { path: '/ViewAllOfficials', element: <ViewAllOfficials /> },
  { path: '/ViewOfficial/:id', element: <BrgyOfficialProfile /> },
  { path: '/AboutUs', element: <AboutUs /> },
  { path: '/ResolutionandOrdinance', element: <ResolutionOrdinance /> },
  { path: '/Contacts', element: <Contacts /> },
  { path: '/OnlineRequestingDocuments', element: <OnlineRequestingDocuments /> },
  { path: '/Login', element: <LoginPage /> },
  { path: '/Register', element: <RegisterPage /> },
  { path: '/Unauthorized', element: <NotFoundPage /> },
];

export default publicRoutesConfig;