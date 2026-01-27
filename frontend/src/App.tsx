import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// import { Dashboard } from './pages/Dashboard';
import { Suspense, lazy, type JSX } from 'react';
import { PetDetalhe } from './pages/Pets/PetDetalhe';
import { PetForm } from './pages/Pets/PetForm';
import { TutorList } from './pages/Tutores/TutorList';
import { TutorDetalhe } from './pages/Tutores/TutorDetalhe';

const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));

// Componente para Proteger Rotas
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

const Loading = () => <div className="flex h-screen items-center justify-center">Carregando...</div>;

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/health" element={<div className="p-4 text-green-600">UP</div>} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/tutores" element={
          <PrivateRoute>
            <TutorList />
          </PrivateRoute>
        } />
        {/* Rota para CRIAR (deve vir antes das rotas com :id para evitar conflito) */}
        <Route 
          path="/pets/novo" 
          element={
            <PrivateRoute>
              <PetForm />
            </PrivateRoute>
          } 
        />

        {/* Rota para EDITAR (Reaproveita o mesmo componente) */}
        <Route 
          path="/pets/editar/:id" 
          element={
            <PrivateRoute>
              <PetForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/pets/:id" 
          element={
            <PrivateRoute>
              <PetDetalhe />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/tutores/:id" 
          element={
            <PrivateRoute>
              <TutorDetalhe />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;