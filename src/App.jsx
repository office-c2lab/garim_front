import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/AppShell.jsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import MonitoringPage from './pages/MonitoringPage/MonitoringPage.jsx';
import PolicyPage from './pages/PolicyPage/PolicyPage.jsx';
import DomainPage from './pages/DomainPage/DomainPage.jsx';
import UserPage from './pages/UserPage/UserPage.jsx';
import SupportPage from './pages/SupportPage/SupportPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/policies" element={<PolicyPage />} />
        <Route path="/domains" element={<DomainPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
    </Routes>
  );
}
