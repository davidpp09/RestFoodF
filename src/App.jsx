import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from "./components/ProtectedRoute"
import { ROLES, SUPER_ROLES } from './constants/roles';
import AuthRedirect from "./components/AuthRedirect"
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';



export default function App() {
  const { verifyLogin } = useAuth();
  useEffect(() => {
    verifyLogin();
  }, []);
  const MesaPanel = () => <div className="p-10"><h1>Panel de Mesas (En construcción 🏗️)</h1></div>;
  const PedidosPanel = () => <div className="p-10"><h1>Panel de Pedidos (En construcción 🏗️)</h1></div>;
  const RepartidorPanel = () => <div className="p-10"><h1>Panel de Repartidor (En construcción 🏗️)</h1></div>;
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/adminpanel" element={
        <ProtectedRoute roleRequired={SUPER_ROLES}>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/pedidos" element={
        <ProtectedRoute roleRequired={ROLES.MESERO}>
          <MesaPanel />
        </ProtectedRoute>
      } />
      <Route path="/cocina-panel" element={
        <ProtectedRoute roleRequired={ROLES.COCINA}>
          <PedidosPanel />
        </ProtectedRoute>
      } />
      <Route path="/entregas" element={
        <ProtectedRoute roleRequired={ROLES.REPARTIDOR}>
          <RepartidorPanel />
        </ProtectedRoute>
      } />
      <Route path="/" element={<AuthRedirect />} />
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}