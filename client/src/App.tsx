import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavBar } from './components/NavBar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FeedPage } from './pages/FeedPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { UserProfilePage } from './pages/UserProfilePage';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<RequireAuth><FeedPage /></RequireAuth>} />
        <Route path="/posts/:id" element={<RequireAuth><PostDetailPage /></RequireAuth>} />
        <Route path="/users/:id" element={<RequireAuth><UserProfilePage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
