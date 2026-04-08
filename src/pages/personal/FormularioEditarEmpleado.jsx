import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usuarioService } from "@/services/usuarioService";
import { toast } from "sonner";

const ROLES = ["ADMIN", "MESERO", "COCINA", "CAJERO", "REPARTIDOR"];

const FormularioEditarEmpleado = ({ usuario, abierto, onCerrar, onActualizado }) => {
    const [datos, setDatos] = useState({
        id_usuarios: "",
        nombre: "",
        email: "",
        rol: ""
    });

    useEffect(() => {
        if (usuario) {
            setDatos({
                id_usuarios: usuario.id_usuarios,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
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
            onActualizado?.();
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
                        Modifica los datos del empleado.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
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

                    <div className="grid gap-2">
                        <Label>Puesto / Rol</Label>
                        <Select value={datos.rol} onValueChange={(valor) => setDatos(prev => ({ ...prev, rol: valor }))}>
                            <SelectTrigger className="bg-slate-950 border-slate-800">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                {ROLES.map(rol => (
                                    <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800">
                        Cancelar
                    </Button>
                    <Button onClick={manejarGuardado} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Guardar Cambios
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormularioEditarEmpleado;