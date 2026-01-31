import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';
import { TeacherDashboard } from './pages/Dashboard/TeacherDashboard';
import { StudentDashboard } from './pages/Dashboard/StudentDashboard';
import { TasksList } from './pages/Tasks/TasksList';
import { TaskDetail } from './pages/Tasks/TaskDetail';
import { CreateTask } from './pages/Tasks/CreateTask';
import { OnboardingTree } from './pages/OnboardingTree';
import { Students } from './pages/Students';
import { TeamMembers } from './pages/TeamMembers';
import { MyTeacher } from './pages/MyTeacher';
import { UserManagement } from './pages/UserManagement';
import { RaiseSupport } from './pages/RaiseSupport';
import { SupportTickets } from './pages/SupportTickets';

// Dashboard router component that selects the right dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/tasks/:taskId" element={<TaskDetail />} />
            <Route path="/all-tasks" element={<TasksList />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/onboarding-tree" element={<OnboardingTree />} />
            <Route path="/students" element={<Students />} />
            <Route path="/team-members" element={<TeamMembers />} />
            <Route path="/my-teacher" element={<MyTeacher />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/raise-support" element={<RaiseSupport />} />
            <Route path="/support-tickets" element={<SupportTickets />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
