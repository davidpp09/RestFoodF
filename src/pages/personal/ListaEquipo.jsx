import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import { colorDeMesera } from "./colores";
import RolBadge from "./RolBadge";

const FILTROS = ["TODOS", "MESERO", "REPARTIDOR", "COCINA", "CAJERO", "ADMIN"];

const ListaEquipo = ({ usuarios, meseras, mesasPorUsuario, onAbrir }) => {
    const [filtro, setFiltro] = useState("TODOS");
    const [busqueda, setBusqueda] = useState("");
    const [verBajas, setVerBajas] = useState(false);

    const bajas = usuarios.filter(u => !u.estatus).length;

    const visibles = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return usuarios
            .filter(u => verBajas ? !u.estatus : u.estatus)
            .filter(u => filtro === "TODOS" || u.rol === filtro)
            .filter(u => !texto || u.nombre.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto));
    }, [usuarios, filtro, busqueda, verBajas]);

    const cuenta = (rol) => usuarios.filter(u => u.estatus === !verBajas && (rol === "TODOS" || u.rol === rol)).length;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                {FILTROS.filter(f => f === "TODOS" || cuenta(f) > 0).map(f => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFiltro(f)}
                        className={`h-8 px-3 rounded-full text-xs font-semibold tracking-wide border transition-colors ${
                            filtro === f
                                ? "bg-rf-text text-rf-bg border-rf-text"
                                : "bg-rf-surface text-rf-text-2 border-rf-border hover:border-rf-border-strong"
                        }`}
                    >
                        {f === "TODOS" ? "Todos" : f} <span className="font-mono opacity-70">{cuenta(f)}</span>
                    </button>
                ))}
                <div className="relative ml-auto w-full sm:w-56">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rf-text-3" />
                    <Input
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre o correo"
                        className="pl-9 h-9 bg-rf-surface border-rf-border-strong"
                    />
                </div>
            </div>

            <div className="bg-rf-surface rounded-lg border border-rf-border shadow-rf-sm divide-y divide-rf-border overflow-hidden">
                {visibles.length === 0 && (
                    <p className="p-6 text-center text-rf-text-3">
                        {verBajas ? "No hay empleados dados de baja." : "Nadie coincide con el filtro."}
                    </p>
                )}
                {visibles.map(u => {
                    const esMesera = u.rol === "MESERO" && u.estatus;
                    const nMesas = mesasPorUsuario[u.id_usuarios]?.length ?? 0;
                    return (
                        <button
                            key={u.id_usuarios}
                            type="button"
                            onClick={() => onAbrir(u)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-rf-surface-2 transition-colors"
                        >
                            <div className={`size-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                                esMesera ? colorDeMesera(meseras, u.id_usuarios).mesa + " border-2" : "bg-rf-surface-2 text-rf-text-2"
                            }`}>
                                {u.nombre.slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-rf-text truncate">{u.nombre}</p>
                                <p className="text-sm text-rf-text-3 truncate">{u.email}</p>
                            </div>
                            {esMesera && (
                                <span className={`hidden sm:inline text-sm font-mono ${nMesas === 0 ? "text-rf-red-ink font-semibold" : "text-rf-text-2"}`}>
                                    {nMesas === 0 ? "sin mesas" : `${nMesas} mesas`}
                                </span>
                            )}
                            <RolBadge rol={u.rol} />
                            <ChevronRight size={18} className="text-rf-text-3 shrink-0" />
                        </button>
                    );
                })}
            </div>

            {(bajas > 0 || verBajas) && (
                <button type="button" onClick={() => { setVerBajas(v => !v); setFiltro("TODOS"); }} className="text-sm text-rf-text-2 hover:text-rf-text underline underline-offset-4">
                    {verBajas ? "Volver al equipo activo" : `Ver dados de baja (${bajas})`}
                </button>
            )}
        </div>
    );
};

export default ListaEquipo;
