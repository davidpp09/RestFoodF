import { useState } from "react";
import { useFormEmpleado } from "@/hooks/useFormEmpleado";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { ROLES_FORM } from "@/constants/roles";

const Campo = ({ label, id, error, type, ...props }) => {
    const [mostrar, setMostrar] = useState(false);
    const esContrasena = type === "password";

    return (
        <div className="grid gap-2">
            <Label htmlFor={id} className={error && "text-red-500"}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={esContrasena ? (mostrar ? "text" : "password") : type}
                    className={`bg-slate-950 ${esContrasena && "pr-10"} ${error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-800"}`}
                    {...props}
                />
                {esContrasena && (
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-400 hover:text-white"
                        onClick={() => setMostrar(!mostrar)}
                    >
                        {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        </div>
    );
};

const FormularioNuevoEmpleado = ({ onEmpleadoCreado }) => {
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const { nuevoUsuario, manejarCambio, actualizarRol, guardar, errores } = useFormEmpleado();

    const manejarGuardado = async () => {
        const exito = await guardar();
        
        if (exito) {
            setDialogAbierto(false);
            onEmpleadoCreado?.();
        }
    };

    return (
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold cursor-pointer select-none active:scale-95">
                <UserPlus size={20} />
                <span>Nuevo Empleado</span>
            </DialogTrigger>

            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Empleado 👤</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Completa los datos del integrante del equipo.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Campo label="Nombre" id="nombre" name="nombre" value={nuevoUsuario.nombre} onChange={manejarCambio} error={errores.nombre} />
                    <Campo label="Email" id="email" name="email" type="email" value={nuevoUsuario.email} onChange={manejarCambio} error={errores.email} />
                    <Campo label="Contraseña" id="contrasena" name="contrasena" type="password" value={nuevoUsuario.contrasena} onChange={manejarCambio} error={errores.contrasena} />

                    <div className="grid gap-2">
                        <Label className={errores.rol && "text-red-500"}>Puesto / Rol</Label>
                        <Select value={nuevoUsuario.rol} onValueChange={actualizarRol}>
                            <SelectTrigger className={`bg-slate-950 ${errores.rol ? "border-red-500 focus:ring-red-500" : "border-slate-800"}`}>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                {ROLES_FORM.map(rol => (
                                    <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errores.rol && <span className="text-xs text-red-500 font-medium">{errores.rol}</span>}
                    </div>
                </div>

                <Button onClick={manejarGuardado} className="bg-orange-600 hover:bg-orange-700 w-full mt-2">
                    Guardar Empleado
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default FormularioNuevoEmpleado;