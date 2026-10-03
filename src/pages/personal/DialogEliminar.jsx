import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { usuarioService } from "@/services/usuarioService";
import { toast } from "sonner";

const DialogEliminar = ({ usuario, mesasAsignadas = 0, abierto, onCerrar, onEliminado }) => {
    const manejarEliminar = async () => {
        const toastId = toast.loading("Dando de baja...");

        try {
            await usuarioService.eliminarUsuario(usuario.id_usuarios);
            toast.success(`${usuario.nombre} quedó dado de baja`, { id: toastId });
            onCerrar();
            onEliminado?.();
        } catch {
            toast.error("No se pudo dar de baja. ❌", { id: toastId });
        }
    };

    return (
        <AlertDialog open={abierto} onOpenChange={onCerrar}>
            <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Dar de baja a {usuario?.nombre}?</AlertDialogTitle>
                    <AlertDialogDescription className="text-rf-text-2">
                        Ya no podrá entrar al sistema. Su historial de ventas se conserva y
                        puedes reactivarlo después desde "Ver dados de baja".
                        {mesasAsignadas > 0 && (
                            <span className="block mt-2 font-semibold text-rf-red-ink">
                                Sus {mesasAsignadas} mesas quedarán sin asignar. Si alguien la va a cubrir,
                                usa primero "Cubrir su turno".
                            </span>
                        )}
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
                        Dar de baja
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DialogEliminar;