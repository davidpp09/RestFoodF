import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usuarioService } from "@/services/usuarioService";
import { toast } from "sonner";

const FormularioEditarEmpleado = ({ usuario, abierto, onCerrar, onActualizado }) => {
    // 1. Ya solo guardamos en memoria lo que el backend acepta
    const [datos, setDatos] = useState({
        id_usuarios: "",
        nombre: "",
        email: ""
    });

    useEffect(() => {
        if (usuario) {
            setDatos({
                id_usuarios: usuario.id_usuarios,
                nombre: usuario.nombre,
                email: usuario.email
            });
        }
    }, [usuario]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };

    const manejarGuardado = async () => {
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
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Empleado ✏️</DialogTitle>
                    <DialogDescription className="text-slate-400">
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
                            className="bg-slate-950 border-slate-800"
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
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} className="bg-red-600 text-white hover:bg-red-700 flex-1 border-slate-700 hover:bg-slate-800 text-slate-300">
                        Cancelar
                    </Button>
                    <Button onClick={manejarGuardado} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        Guardar Cambios
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormularioEditarEmpleado;