import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Suspense, lazy, type JSX } from 'react';
import { PetDetalhe } from './pages/Pets/PetDetalhe';
import { PetForm } from './pages/Pets/PetForm';
import { TutorList } from './pages/Tutores/TutorList';
import { TutorDetalhe } from './pages/Tutores/TutorDetalhe';
import { TutorForm } from './pages/Tutores/TutorForm';
import { PetList } from './pages/Pets/PetList';
import { VinculoManager } from './pages/Vinculos/VinculoManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importante!
import { Loading } from './components/ui/loading';
import { AppLayout } from './_layouts/AppLayout';
import { ModalProvider } from './context/ModalContext';

const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (

    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/health" element={<div className="p-4 text-green-600">UP</div>} />

        <Route element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>

          <Route path="/" element={<Dashboard />} />

          {/* PETS */}
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/novo" element={<PetForm />} />
          <Route path="/pets/editar/:id" element={<PetForm />} />
          <Route path="/pets/:id" element={<PetDetalhe />} />

          {/* TUTOR */}
          <Route path="/tutores" element={<TutorList />} />
          <Route path="/tutores/novo" element={<TutorForm />} />
          <Route path="/tutores/editar/:id" element={<TutorForm />} />
          <Route path="/tutores/:id" element={<TutorDetalhe />} />

          {/* VINCULO */}
          <Route path="/tutores/:id/pet/novo" element={<VinculoManager />} />
          <Route path="/pets/:id/tutor/novo" element={<VinculoManager />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
        <ModalProvider>
          <AppRoutes />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;