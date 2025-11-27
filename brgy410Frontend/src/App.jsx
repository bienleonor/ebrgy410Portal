import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import publicRoutesConfig from "./routes/PublicRoutesConfig";
import privateRoutesConfig from "./routes/PrivateRoutesConfig";

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
      </Routes>
    </AuthProvider>
  );
};

export default App;
