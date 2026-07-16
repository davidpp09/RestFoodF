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
            <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro? 🗑️</AlertDialogTitle>
                    <AlertDialogDescription className="text-rf-text-2">
                        Vas a desactivar a <span className="font-bold text-rf-text">{usuario?.nombre}</span>.
                        El usuario quedará inactivo pero podrás reactivarlo después.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={manejarEliminar}
                        className="bg-rf-red hover:bg-rf-red/90"
                    >
                        Desactivar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DialogEliminar;