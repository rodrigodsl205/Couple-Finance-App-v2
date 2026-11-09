import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SpacesProvider } from '@/hooks/useSpaces';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';

// Importação das páginas da aplicação (ajuste os caminhos se os nomes forem diferentes no seu projeto)
import DashboardPage from '@/pages/DashboardPage'; 
import TransactionsPage from '@/pages/TransactionsPage';
import CardsPage from '@/pages/CardsPage';
import CategoriesPage from '@/pages/CategoriesPage';
import SettingsPage from '@/pages/SettingsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        Carregando aplicação...
      </div>
    );
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
            {/* Rota pública de login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas protegidas envolvidas pelo Layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              {/* Redireciona a raiz "/" automaticamente para "/dashboard" */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Telas internas acessadas via Sidebar/Navegação */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Rota coringa para redirecionar links desconhecidos */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SpacesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
