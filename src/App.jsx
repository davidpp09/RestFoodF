import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Login from "./pages/Login"
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from "./components/ProtectedRoute"
import { ROLES, SUPER_ROLES } from './constants/roles';
import AuthRedirect from "./components/AuthRedirect"
import { useAuth } from './hooks/useAuth';
import PersonalPanel from './pages/personal/PersonalPanel';
import ReportesPanel from './pages/reportes/ReportesPanel';
import RestLayout from './components/RestLayout';
import MeseroPanel from './pages/Mesas/MeseroPanel';
import PedidosPanel from './pages/cocina/PedidosPanel';

const RepartidorPanel = () => <div className="p-10"><h1>Panel de Repartidor (En construcción 🏗️)</h1></div>;

export default function App() {
  const { verifyLogin } = useAuth();

  useEffect(() => {
    verifyLogin();
  }, []);

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute roleRequired={SUPER_ROLES}>
            <RestLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminPanel />} />
          <Route path="personal" element={<PersonalPanel />} />
          <Route path="reportes" element={<ReportesPanel />} />
        </Route>

        <Route path="/mesero" element={
          <ProtectedRoute roleRequired={[ROLES.MESERO, ...SUPER_ROLES]}>
            <RestLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MeseroPanel />} />
        </Route>

        <Route path="/cocina-panel" element={
          <ProtectedRoute roleRequired={[ROLES.COCINA, ...SUPER_ROLES]}>
            <RestLayout />
          </ProtectedRoute>
        }>
          <Route index element={<PedidosPanel />} />
        </Route>

        <Route path="/entregas" element={
          <ProtectedRoute roleRequired={[ROLES.REPARTIDOR, ...SUPER_ROLES]}>
            <RepartidorPanel />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<AuthRedirect />} />
        <Route path="*" element={<AuthRedirect />} />
      </Routes>
    </>

  );
}