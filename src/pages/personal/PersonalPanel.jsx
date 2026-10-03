import { useState } from "react";
import { usePersonal } from "@/hooks/usePersonal";
import { Loader2, Users, LayoutGrid } from "lucide-react";
import ListaEquipo from "./ListaEquipo";
import MapaMesas from "./MapaMesas";
import FichaEmpleado from "./FichaEmpleado";
import FormularioNuevoEmpleado from "./FormularioNuevoEmpleado";
import FormularioEditarEmpleado from "./FormularioEditarEmpleado";
import DialogEliminar from "./DialogEliminar";
import DialogCambiarContrasena from "./DialogCambiarContrasena";
import DialogCubrirTurno from "./DialogCubrirTurno";

const PESTANAS = [
    { id: "equipo", etiqueta: "Equipo", icono: Users },
    { id: "mesas", etiqueta: "Mesas", icono: LayoutGrid },
];

/**
 * Personal: el equipo y el reparto de mesas.
 *
 * Solo hay un diálogo abierto a la vez (`vista`). Las acciones de la ficha
 * (editar, contraseña, baja, cubrir turno) cierran la ficha y al terminar
 * regresan a ella, para no apilar diálogos modales en la tablet.
 */
const PersonalPanel = () => {
    const personal = usePersonal();
    const { usuarios, mesas, meseras, mesasPorUsuario, mesasSinAsignar, loading, recargar } = personal;

    const [pestana, setPestana] = useState("equipo");
    const [vista, setVista] = useState(null); // { tipo: 'ficha'|'editar'|'contrasena'|'baja'|'cubrir', id }

    // Siempre el usuario fresco de la lista, no una copia vieja
    const usuario = vista ? usuarios.find(u => u.id_usuarios === vista.id) : null;
    const abrir = (tipo, id = vista?.id) => setVista({ tipo, id });
    const volverAFicha = () => setVista(v => (v ? { tipo: "ficha", id: v.id } : null));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-rf-surface rounded-lg border border-rf-border">
                <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                <p className="text-rf-text-2 font-medium">Cargando personal...</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Personal</h1>
                    <p className="text-rf-text-2">El equipo del restaurante y quién atiende cada mesa</p>
                </div>
                <FormularioNuevoEmpleado
                    onEmpleadoCreado={async (nuevo) => {
                        await recargar();
                        // A una mesera nueva lo siguiente es darle mesas: se abre su ficha
                        if (nuevo?.rol === "MESERO") setVista({ tipo: "ficha", id: nuevo.id_usuarios });
                    }}
                />
            </div>

            <div className="inline-flex p-1 rounded-lg bg-rf-surface-2 border border-rf-border">
                {PESTANAS.map(({ id, etiqueta, icono }) => {
                    const Icono = icono;
                    return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setPestana(id)}
                        className={`inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-semibold transition-colors ${
                            pestana === id ? "bg-rf-surface text-rf-text shadow-rf-sm" : "text-rf-text-2 hover:text-rf-text"
                        }`}
                    >
                        <Icono size={16} /> {etiqueta}
                        {id === "mesas" && mesasSinAsignar.length > 0 && (
                            <span className="size-2 rounded-full bg-rf-red" title="Hay mesas sin asignar" />
                        )}
                    </button>
                    );
                })}
            </div>

            {pestana === "equipo" ? (
                <ListaEquipo usuarios={usuarios} meseras={meseras} mesasPorUsuario={mesasPorUsuario} onAbrir={(u) => abrir("ficha", u.id_usuarios)} />
            ) : (
                <MapaMesas mesas={mesas} meseras={meseras} mesasPorUsuario={mesasPorUsuario} mesasSinAsignar={mesasSinAsignar} recargar={recargar} />
            )}

            <FichaEmpleado
                key={usuario?.id_usuarios}
                usuario={usuario}
                abierto={vista?.tipo === "ficha" && Boolean(usuario)}
                onCerrar={() => setVista(null)}
                mesas={mesas}
                meseras={meseras}
                recargar={recargar}
                onEditar={() => abrir("editar")}
                onContrasena={() => abrir("contrasena")}
                onBaja={() => abrir("baja")}
                onCubrir={() => abrir("cubrir")}
            />

            <FormularioEditarEmpleado
                usuario={usuario}
                abierto={vista?.tipo === "editar"}
                onCerrar={volverAFicha}
                onActualizado={recargar}
            />

            <DialogCambiarContrasena
                usuario={usuario}
                abierto={vista?.tipo === "contrasena"}
                onCerrar={volverAFicha}
            />

            <DialogEliminar
                usuario={usuario}
                mesasAsignadas={usuario ? (mesasPorUsuario[usuario.id_usuarios]?.length ?? 0) : 0}
                abierto={vista?.tipo === "baja"}
                onCerrar={volverAFicha}
                onEliminado={recargar}
            />

            {vista?.tipo === "cubrir" && (
                <DialogCubrirTurno
                    abierto
                    onCerrar={volverAFicha}
                    meseras={meseras}
                    mesasPorUsuario={mesasPorUsuario}
                    deInicial={vista.id}
                    onHecho={recargar}
                />
            )}
        </div>
    );
};

export default PersonalPanel;
