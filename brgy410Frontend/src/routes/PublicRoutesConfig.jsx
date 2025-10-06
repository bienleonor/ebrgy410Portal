import Homepage from '../pages/Homepage';
import ViewAllOfficials from '../pages/ViewAllOfficials';
import CreateOfficial from '../pages/CreateOfficial';
import BrgyOfficialProfile from '../pages/BrgyOfficialProfile';
import AboutUs from '../pages/AboutUs';
import ResolutionOrdinance from '../pages/Resolution&Ordinance';
import Contacts from '../pages/Contacts';
import OnlineRequestingDocuments from '../pages/OnlineRequestingDocuments';
import AdminLogin from '../pages/AdminLogin';
import AdminRegister from '../pages/AdminRegister';
import Form from '../pages/Form';

const publicRoutesConfig = [
  { path: '/', element: <Homepage /> },
  { path: '/Register', element: <CreateOfficial /> },
  { path: '/ViewAllOfficials', element: <ViewAllOfficials /> },
  { path: '/ViewOfficial/:id', element: <BrgyOfficialProfile /> },
  { path: '/AboutUs', element: <AboutUs /> },
  { path: '/ResolutionandOrdinance', element: <ResolutionOrdinance /> },
  { path: '/Contacts', element: <Contacts /> },
  { path: '/OnlineRequestingDocuments', element: <OnlineRequestingDocuments /> },
  { path: '/AdminLogin', element: <AdminLogin /> },
  { path: '/AdminRegister', element: <AdminRegister /> },
  { path: '/Form', element: <Form /> },
];

export default publicRoutesConfig;