import { useEffect, useMemo, useState } from 'react';
import { grupoPrecioService } from '@/services/grupoPrecioService';

const mensajeError = async (error) => {
    const datos = error?.response?.data;
    if (datos instanceof Blob) {
        try { return JSON.parse(await datos.text()).mensaje; } catch { /* Usa el mensaje general. */ }
    }
    return datos?.mensaje || 'No se pudo cargar el menú. Intenta de nuevo.';
};

export function useMenuPrecios() {
    const [pagina, setPagina] = useState(1);
    const [vista, setVista] = useState('menu');
    const [hojaCompleta, setHojaCompleta] = useState(false);
    const [revision, setRevision] = useState(0);
    const [mapa, setMapa] = useState(null);
    const [grupos, setGrupos] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [seleccion, setSeleccion] = useState(null);
    const [precio, setPrecio] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [errorGuardar, setErrorGuardar] = useState('');
    const [aviso, setAviso] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [productoHistorial, setProductoHistorial] = useState('');
    const [historial, setHistorial] = useState([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [errorHistorial, setErrorHistorial] = useState('');

    useEffect(() => {
        const control = new AbortController();
        async function cargar() {
            setCargando(true);
            setError('');
            try {
                const [nuevoMapa, nuevosGrupos, png] = await Promise.all([
                    grupoPrecioService.obtenerMapa(control.signal),
                    grupoPrecioService.obtenerGrupos(control.signal),
                    grupoPrecioService.obtenerImagen(pagina, control.signal),
                ]);
                if (control.signal.aborted) return;
                setMapa(nuevoMapa);
                setGrupos(nuevosGrupos);
                setImagen(URL.createObjectURL(png));
            } catch (e) {
                if (!control.signal.aborted) setError(await mensajeError(e));
            } finally {
                if (!control.signal.aborted) setCargando(false);
            }
        }
        cargar();
        return () => control.abort();
    }, [pagina, revision]);

    useEffect(() => () => { if (imagen) URL.revokeObjectURL(imagen); }, [imagen]);

    useEffect(() => {
        const control = new AbortController();
        async function cargar() {
            if (!productoHistorial) {
                // El pedido anterior pudo abortarse antes de apagar su indicador.
                setCargandoHistorial(false);
                setErrorHistorial('');
                setHistorial([]);
                return;
            }
            setCargandoHistorial(true);
            setErrorHistorial('');
            try {
                const datos = await grupoPrecioService.historial(productoHistorial, control.signal);
                if (!control.signal.aborted) setHistorial(datos);
            } catch (e) {
                const mensaje = await mensajeError(e);
                if (!control.signal.aborted) setErrorHistorial(mensaje);
            } finally {
                if (!control.signal.aborted) setCargandoHistorial(false);
            }
        }
        cargar();
        return () => control.abort();
    }, [productoHistorial]);

    const porClave = useMemo(() => Object.fromEntries(grupos.map(g => [g.clave, g])), [grupos]);
    const grupo = seleccion ? porClave[seleccion] : null;
    const entradas = useMemo(() => (mapa?.entradas ?? []).filter(e => e.pagina === pagina), [mapa, pagina]);
    const visibles = useMemo(() => {
        const claves = new Set(entradas.map(e => e.clave));
        const normal = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const consulta = normal(busqueda.trim());
        return grupos.filter(g => claves.has(g.clave) && normal([g.nombre, ...g.productos.map(p => p.nombre), ...(g.faltantes ?? [])].join(' ')).includes(consulta));
    }, [grupos, entradas, busqueda]);
    const pendientes = grupos.filter(g => g.mixto || !g.productos.length || g.faltantes?.length || g.precio == null);

    function abrir(clave) {
        const elegido = porClave[clave];
        if (!elegido || cargando || error) return;
        setSeleccion(clave);
        setPrecio(elegido.precio == null ? '' : String(elegido.precio));
        setErrorGuardar('');
        setProductoHistorial('');
        setHistorial([]);
    }
    function cerrar() { if (!guardando) { setSeleccion(null); setProductoHistorial(''); } }
    async function guardar(evento) {
        evento.preventDefault();
        if (!grupo?.productos.length || grupo.faltantes?.length || guardando) return;
        const limpio = precio.trim().replace(',', '.');
        if (!/^\d{1,6}(\.\d{1,2})?$/.test(limpio)) {
            setErrorGuardar('Escribe un precio entre 0 y 999999.99, con máximo dos decimales.');
            return;
        }
        setGuardando(true);
        setErrorGuardar('');
        try {
            await grupoPrecioService.actualizar(grupo.clave, Number(limpio));
            setAviso(`Precio guardado para ${grupo.productos.length} ${grupo.productos.length === 1 ? 'platillo' : 'platillos'}. Las órdenes abiertas conservan su precio.`);
            setSeleccion(null);
            setProductoHistorial('');
            setRevision(v => v + 1);
        } catch (e) {
            setErrorGuardar(await mensajeError(e));
        } finally { setGuardando(false); }
    }
    return { pagina, setPagina, vista, setVista, hojaCompleta, setHojaCompleta, mapa, grupos, porClave, entradas, visibles, pendientes,
        imagen, cargando, error, recargar: () => setRevision(v => v + 1),
        grupo, abrir, cerrar, precio, setPrecio, guardando, guardar, errorGuardar, aviso,
        busqueda, setBusqueda, productoHistorial, setProductoHistorial, historial, cargandoHistorial, errorHistorial };
}
