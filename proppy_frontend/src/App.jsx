import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layout/PublicLayout';
import DashboardLayout from './layout/DashboardLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const OwnersPage = lazy(() => import('./pages/OwnersPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const OwnershipPage = lazy(() => import('./pages/OwnershipPage'));
const TwoColumnLogin = lazy(() => import('./pages/TwoColumnLogin'));

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* LOGIN */}
              <Route path="/login" element={<TwoColumnLogin />} />
              {/* PUBLIC */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/login" element={<TwoColumnLogin //>} /> */}
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
