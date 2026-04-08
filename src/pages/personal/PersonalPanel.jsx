import { useState } from "react";
import { usePersonal } from "@/hooks/usePersonal";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Loader2 } from "lucide-react";
import FormularioNuevoEmpleado from "./FormularioNuevoEmpleado";
import FormularioEditarEmpleado from "./FormularioEditarEmpleado";
import DialogEliminar from "./DialogEliminar";

const PersonalPanel = () => {
    const { usuarios, loading, recargar } = usePersonal();

    const [editarAbierto, setEditarAbierto] = useState(false);
    const [eliminarAbierto, setEliminarAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const manejarEditar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setEditarAbierto(true);
    };

    const manejarEliminar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setEliminarAbierto(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-800">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Cargando personal...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestión de Personal </h1>
                    <p className="text-slate-400">Administra los usuarios y roles de tu restaurante</p>
                </div>
                <FormularioNuevoEmpleado onEmpleadoCreado={recargar} />
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={usuarios}
                    onEdit={manejarEditar}
                    onDelete={manejarEliminar}
                />
            </div>

            <FormularioEditarEmpleado
                usuario={usuarioSeleccionado}
                abierto={editarAbierto}
                onCerrar={() => setEditarAbierto(false)}
                onActualizado={recargar}
            />

            <DialogEliminar
                usuario={usuarioSeleccionado}
                abierto={eliminarAbierto}
                onCerrar={() => setEliminarAbierto(false)}
                onEliminado={recargar}
            />
        </div>
    );
};

export default PersonalPanel;