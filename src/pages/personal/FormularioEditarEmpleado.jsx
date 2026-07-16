import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usuarioService } from "@/services/usuarioService";
import { ROLES_FORM } from "@/constants/roles";
import { toast } from "sonner";

const FormularioEditarEmpleado = ({ usuario, abierto, onCerrar, onActualizado }) => {
    // 1. Ya solo guardamos en memoria lo que el backend acepta
    const [datos, setDatos] = useState({
        id_usuarios: "",
        nombre: "",
        email: "",
        rol: "",
        seccion: null
    });

    useEffect(() => {
        if (usuario) {
            setDatos({
                id_usuarios: usuario.id_usuarios,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                seccion: usuario.seccion ?? null
            });
        }
    }, [usuario]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const manejarGuardado = async () => {
        if (datos.rol === 'MESERO' && !datos.seccion) {
            toast.error("Un mesero necesita una sección de mesas asignada.");
            return;
        }
        const toastId = toast.loading("Actualizando empleado...");

        try {
            await usuarioService.actualizarUsuario(datos);
            toast.success("¡Empleado actualizado correctamente! ✅", { id: toastId });
            onCerrar();
            onActualizado?.(); // Recarga la tabla de atrás
        } catch (error) {
            toast.error("Error al actualizar el empleado. ❌", { id: toastId });
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={onCerrar}>
            <DialogContent className="bg-rf-surface border-rf-border text-rf-text sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Empleado ✏️</DialogTitle>
                    <DialogDescription className="text-rf-text-2">
                        Modifica los datos personales del empleado.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Solo dejamos Nombre y Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-nombre">Nombre</Label>
                        <Input
                            id="edit-nombre"
                            name="nombre"
                            value={datos.nombre}
                            onChange={manejarCambio}
                            className="bg-rf-bg border-rf-border-strong"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            name="email"
                            type="email"
                            value={datos.email}
                            onChange={manejarCambio}
                            className="bg-rf-bg border-rf-border-strong"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Puesto / Rol</Label>
                        <Select
                            value={datos.rol}
                            onValueChange={(rol) => setDatos(prev => ({ ...prev, rol, seccion: rol === 'MESERO' ? prev.seccion : null }))}
                        >
                            <SelectTrigger className="bg-rf-bg border-rf-border-strong">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-rf-surface border-rf-border text-rf-text">
                                {ROLES_FORM.map(rol => (
                                    <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {datos.rol === 'MESERO' && (
                        <div className="grid gap-2">
                            <Label>Sección de mesas</Label>
                            <Select
                                value={datos.seccion?.toString() ?? ""}
                                onValueChange={(v) => setDatos(prev => ({ ...prev, seccion: Number(v) }))}
                            >
                                <SelectTrigger className="bg-rf-bg border-rf-border-strong">
                                    <SelectValue placeholder="Selecciona la sección" />
                                </SelectTrigger>
                                <SelectContent className="bg-rf-surface border-rf-border text-rf-text">
                                    <SelectItem value="1">Sección 1 — Mesas 1 al 10</SelectItem>
                                    <SelectItem value="2">Sección 2 — Mesas 11 al 20</SelectItem>
                                    <SelectItem value="3">Sección 3 — Mesas 21 al 30</SelectItem>
                                    <SelectItem value="4">Sección 4 — Mesas 31 al 40</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} className="flex-1 bg-transparent border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2 hover:text-rf-text">
                        Cancelar
                    </Button>
                    <Button onClick={manejarGuardado} className="flex-1 bg-rf-accent hover:bg-rf-accent-strong text-white">
                        Guardar Cambios
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormularioEditarEmpleado;