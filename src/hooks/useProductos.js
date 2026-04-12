import { useState, useEffect } from "react";
import { productoService } from "../services/productoService";
import { toast } from "sonner";

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setProductos(await productoService.obtenerTodos());
            } catch (error) {
                toast.error('Error al cargar el menú');
            } finally {
                setCargando(false);
            }
        };

        cargarProductos();
    }, []);

    return { productos, cargando };
};
