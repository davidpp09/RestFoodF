import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const FormularioNuevoEmpleado = () => {
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: "",
        email: "",
        contrasena: "",
        rol: ""
    });

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario({
            ...nuevoUsuario,
            [name]: value
        });
    };

    const guardar = () => {
        console.log("Datos listos para enviar al backend:", nuevoUsuario);
    };

    return (
        <Dialog>
            {/* ✅ Usamos un div con estilos de botón en lugar del componente Button */}
            <DialogTrigger >
                <div
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold cursor-pointer select-none active:scale-95"
                    role="button"
                    tabIndex={0}
                >
                    <UserPlus size={20} />
                    <span>Nuevo Empleado</span>
                </div>
            </DialogTrigger>

            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Empleado 👤</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Completa los datos del nuevo integrante.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Campo Nombre */}
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            value={nuevoUsuario.nombre}
                            onChange={manejarCambio}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={nuevoUsuario.email}
                            onChange={manejarCambio}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="grid gap-2">
                        <Label htmlFor="contrasena">Contraseña</Label>
                        <Input
                            id="contrasena"
                            name="contrasena"
                            type="password"
                            value={nuevoUsuario.contrasena}
                            onChange={manejarCambio}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>

                    {/* Campo Rol (Select) */}
                    <div className="grid gap-2">
                        <Label>Puesto / Rol</Label>
                        <Select
                            onValueChange={(valor) => setNuevoUsuario({ ...nuevoUsuario, rol: valor })}
                        >
                            <SelectTrigger className="bg-slate-950 border-slate-800">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                <SelectItem value="MESERO">Mesero</SelectItem>
                                <SelectItem value="COCINA">Cocina</SelectItem>
                                <SelectItem value="CAJERO">Cajero</SelectItem>
                                <SelectItem value="REPARTIDOR">Repartidor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={guardar} className="bg-orange-600 hover:bg-orange-700 w-full">
                        Guardar Empleado
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormularioNuevoEmpleado;