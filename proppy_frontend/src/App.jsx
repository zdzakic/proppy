import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layout/PublicLayout';
import DashboardLayout from './layout/DashboardLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Table1 from './pages/Table1';
import Table2 from './pages/Table2';
import Table3 from './pages/Table3';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
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
                <Route path="/table1" element={<Table1 />} />
                <Route path="/table2" element={<Table2 />} />
                <Route path="/table3" element={<Table3 />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
