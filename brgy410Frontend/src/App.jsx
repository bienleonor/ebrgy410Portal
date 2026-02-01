import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import publicRoutesConfig from "./routes/PublicRoutesConfig";
import privateRoutesConfig from "./routes/PrivateRoutesConfig";
import NotFoundPage from './pages/NotFoundPage';

const renderRoutes = (routes) =>
  routes.map(({ path, element, children }, idx) => (
    <Route key={idx} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        {publicRoutesConfig.map(({ path, element }, idx) => (
          <Route key={idx} path={path} element={element} />
        ))}
        {renderRoutes(privateRoutesConfig)}
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
