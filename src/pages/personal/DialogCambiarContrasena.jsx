import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { usuarioService } from "@/services/usuarioService";
import { toast } from "sonner";

// Misma política que el registro (backend: DatosCambioContrasena)
const PATRON = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const DialogCambiarContrasena = ({ usuario, abierto, onCerrar }) => {
    const [contrasena, setContrasena] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [mostrar, setMostrar] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (abierto) {
            setContrasena("");
            setConfirmacion("");
            setMostrar(false);
        }
    }, [abierto]);

    const manejarGuardado = async () => {
        if (!PATRON.test(contrasena)) {
            toast.error("La contraseña debe tener 8+ caracteres con mayúscula, minúscula, número y símbolo (@$!%*?&).");
            return;
        }
        if (contrasena !== confirmacion) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }
        setGuardando(true);
        const toastId = toast.loading("Cambiando contraseña...");
        try {
            await usuarioService.cambiarContrasena(usuario.id_usuarios, contrasena);
            toast.success(`Contraseña de ${usuario.nombre} actualizada ✅`, { id: toastId });
            onCerrar();
        } catch (error) {
            const mensaje = error.response?.data?.mensaje
                ?? error.response?.data?.[0]?.error
                ?? "Error al cambiar la contraseña.";
            toast.error(mensaje, { id: toastId });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={onCerrar}>
            <DialogContent className="bg-rf-surface border-rf-border text-rf-text sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound size={18} className="text-rf-accent-ink" />
                        Cambiar contraseña
                    </DialogTitle>
                    <DialogDescription className="text-rf-text-2">
                        Nueva contraseña para <span className="text-rf-text font-semibold">{usuario?.nombre}</span>.
                        No se necesita la contraseña anterior.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nueva-contrasena">Nueva contraseña</Label>
                        <div className="relative">
                            <Input
                                id="nueva-contrasena"
                                type={mostrar ? "text" : "password"}
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="bg-rf-bg border-rf-border-strong pr-10"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setMostrar(m => !m)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-rf-text-3 hover:text-rf-text-2"
                                tabIndex={-1}
                            >
                                {mostrar ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <span className="text-xs text-rf-text-3">
                            Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo (@$!%*?&).
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="confirmar-contrasena">Confirmar contraseña</Label>
                        <Input
                            id="confirmar-contrasena"
                            type={mostrar ? "text" : "password"}
                            value={confirmacion}
                            onChange={(e) => setConfirmacion(e.target.value)}
                            className="bg-rf-bg border-rf-border-strong"
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} disabled={guardando}
                        className="flex-1 bg-transparent border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2 hover:text-rf-text">
                        Cancelar
                    </Button>
                    <Button onClick={manejarGuardado} disabled={guardando}
                        className="flex-1 bg-rf-accent hover:bg-rf-accent-strong text-white">
                        {guardando ? "Guardando..." : "Cambiar contraseña"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogCambiarContrasena;
