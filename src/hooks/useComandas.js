import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminService } from '../services/adminService';
import { toast } from 'sonner';

const hoy = () => new Date().toISOString().split('T')[0];

const hace = (dias) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d.toISOString().split('T')[0];
};

// Orden de aparición de los roles en la lista de empleados
const ORDEN_ROL = { MESERO: 0, REPARTIDOR: 1, CAJERO: 2, ADMIN: 3, DEV: 4, COCINA: 5 };

export const useComandas = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fecha, setFecha] = useState(hoy());

    const cargar = useCallback(async (f) => {
        setLoading(true);
        try {
            const data = await adminService.obtenerComandas(f);
            setOrdenes(data);
        } catch (error) {
            console.error('Error al cargar comandas:', error);
            toast.error('Error al cargar las comandas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargar(fecha);
    }, [fecha, cargar]);

    // Agrupa las órdenes por empleado -> [{ id_usuario, nombre, rol, ordenes, totalVendido }]
    const empleados = useMemo(() => {
        const mapa = new Map();
        for (const o of ordenes) {
            if (!mapa.has(o.id_usuario)) {
                mapa.set(o.id_usuario, {
                    id_usuario: o.id_usuario,
                    nombre: o.nombreEmpleado,
                    rol: o.rolEmpleado,
                    ordenes: [],
                    totalVendido: 0,
                });
            }
            const emp = mapa.get(o.id_usuario);
            emp.ordenes.push(o);
            emp.totalVendido += Number(o.total) || 0;
        }
        return Array.from(mapa.values()).sort((a, b) => {
            const ra = ORDEN_ROL[a.rol] ?? 9;
            const rb = ORDEN_ROL[b.rol] ?? 9;
            if (ra !== rb) return ra - rb;
            return a.nombre.localeCompare(b.nombre);
        });
    }, [ordenes]);

    const aplicarPeriodo = (periodo) => {
        if (periodo === 'hoy')  setFecha(hoy());
        if (periodo === 'ayer') setFecha(hace(1));
    };

    return {
        empleados,
        loading,
        fecha,
        setFecha,
        aplicarPeriodo,
        recargar: () => cargar(fecha),
    };
};
