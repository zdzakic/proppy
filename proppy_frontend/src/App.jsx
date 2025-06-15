import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layout/PublicLayout';
import DashboardLayout from './layout/DashboardLayout';

// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import OwnersPage from './pages/OwnersPage';
// import PropertiesPage from './pages/PropertiesPage';
// import OwnershipPage from './pages/OwnershipPage';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const OwnersPage = lazy(() => import('./pages/OwnersPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const OwnershipPage = lazy(() => import('./pages/OwnershipPage'));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* PUBLIC */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>

              {/* DASHBOARD */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/owners" element={<OwnersPage />} />
                  <Route path="/dashboard/properties" element={<PropertiesPage />} />
                  <Route path="/dashboard/ownerships" element={<OwnershipPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
