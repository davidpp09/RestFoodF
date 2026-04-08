import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { usuarioService } from "@/services/usuarioService";
import { toast } from "sonner";

const DialogEliminar = ({ usuario, abierto, onCerrar, onEliminado }) => {
    const manejarEliminar = async () => {
        const toastId = toast.loading("Eliminando empleado...");

        try {
            await usuarioService.eliminarUsuario(usuario.id_usuarios);
            toast.success("¡Empleado desactivado correctamente! 🗑️", { id: toastId });
            onCerrar();
            onEliminado?.();
        } catch (error) {
            toast.error("Error al eliminar el empleado. ❌", { id: toastId });
        }
    };

    return (
        <AlertDialog open={abierto} onOpenChange={onCerrar}>
            <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro? 🗑️</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        Vas a desactivar a <span className="font-bold text-white">{usuario?.nombre}</span>.
                        El usuario quedará inactivo pero podrás reactivarlo después.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={manejarEliminar}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Desactivar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DialogEliminar;