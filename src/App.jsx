import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas para los roles (por ahora marcadores de posición) */}
        <Route path="/admin-dashboard" element={<div className="p-10"><h1>Panel de Admin 👑</h1></div>} />
        <Route path="/pedidos" element={<div className="p-10"><h1>Panel de Mesero 📝</h1></div>} />
        <Route path="/cocina-panel" element={<div className="p-10"><h1>Panel de Cocina 🍳</h1></div>} />
        <Route path="/entregas" element={<div className="p-10"><h1>Panel de Repartidor 🛵</h1></div>} />

        {/* Si el usuario entra a cualquier otra ruta, lo mandamos al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}