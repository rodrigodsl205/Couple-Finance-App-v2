import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SpacesProvider } from '@/hooks/useSpaces';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
// Importe aqui suas outras páginas (Dashboard, Transactions, Cards, etc.)

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SpacesProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </SpacesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}