import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/student/Dashboard';
import Vacancies from './pages/student/Vacancies';
import Applications from './pages/student/Applications';
import StudyMaterials from './pages/student/StudyMaterials';
import Quizzes from './pages/student/Quizzes';

const StudentLayout = ({ children }) => (
  <div className="flex bg-gray-50 min-h-screen">
    <Sidebar />
    <main className="ml-64 flex-1">{children}</main>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student/dashboard" element={
        <ProtectedRoute>
          <StudentLayout><Dashboard /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/vacancies" element={
        <ProtectedRoute>
          <StudentLayout><Vacancies /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/applications" element={
        <ProtectedRoute>
          <StudentLayout><Applications /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/study-materials" element={
        <ProtectedRoute>
          <StudentLayout><StudyMaterials /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/quizzes" element={
        <ProtectedRoute>
          <StudentLayout><Quizzes /></StudentLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}