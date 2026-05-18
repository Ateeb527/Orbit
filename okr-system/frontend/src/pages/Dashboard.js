import { useAuth } from '../context/AuthContext';

import EmployeeDashboard from './dashboard/EmployeeDashboard';
import ManagerDashboard from './dashboard/ManagerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'manager') {
    return <ManagerDashboard />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}