import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import {ROLES,SUPER_ROLES } from './constants/roles';


export default function App() {
  const AdminPanel = () => <div className="p-10"><h1>Panel de Administrador (En construcción 🏗️)</h1></div>;
  const MesaPanel = () => <div className="p-10"><h1>Panel de Mesas (En construcción 🏗️)</h1></div>;
  const PedidosPanel = () => <div className="p-10"><h1>Panel de Pedidos (En construcción 🏗️)</h1></div>;
  const RepartidorPanel = () => <div className="p-10"><h1>Panel de Repartidor (En construcción 🏗️)</h1></div>;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={
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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}