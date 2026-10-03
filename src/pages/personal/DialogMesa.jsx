import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mesaService } from "@/services/mesaService";
import SelectorMesera from "./SelectorMesera";

// Alta de una mesa nueva, o cambio de número de una existente (si llega `mesa`).
const DialogMesa = ({ abierto, onCerrar, mesa, meseras, sugerencia, onHecho }) => {
    const editando = Boolean(mesa);
    const [numero, setNumero] = useState(mesa?.numero ?? sugerencia ?? "");
    const [mesera, setMesera] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const guardar = async () => {
        const valor = numero.trim();
        if (!valor) {
            toast.error("Escribe el número de la mesa");
            return;
        }
        setGuardando(true);
        try {
            if (editando) {
                await mesaService.renombrar(mesa.id_mesa, valor);
                toast.success(`La mesa ${mesa.numero} ahora es la ${valor}`);
            } else {
                await mesaService.crear(valor, mesera && mesera !== "ninguna" ? Number(mesera) : null);
                toast.success(`Mesa ${valor} creada`);
            }
            onHecho?.();
            onCerrar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || "No se pudo guardar la mesa");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={(v) => !v && onCerrar()}>
            <DialogContent className="bg-rf-surface border-rf-border text-rf-text sm:max-w-[380px]">
                <DialogHeader>
                    <DialogTitle>{editando ? `Cambiar número de la mesa ${mesa.numero}` : "Nueva mesa"}</DialogTitle>
                    <DialogDescription className="text-rf-text-2">
                        {editando
                            ? "El historial de cuentas de la mesa se conserva."
                            : "Aparecerá en la tablet de la mesera que elijas."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="numero-mesa">Número</Label>
                        <Input
                            id="numero-mesa"
                            value={numero}
                            maxLength={10}
                            onChange={(e) => setNumero(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && guardar()}
                            className="bg-rf-bg border-rf-border-strong h-10 text-lg font-mono"
                        />
                    </div>
                    {!editando && (
                        <div className="grid gap-2">
                            <Label>La atiende</Label>
                            <SelectorMesera meseras={meseras} value={mesera} onChange={setMesera} permitirNinguna placeholder="Sin asignar" />
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} className="flex-1 bg-transparent border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2">
                        Cancelar
                    </Button>
                    <Button onClick={guardar} disabled={guardando} className="flex-1 bg-rf-accent hover:bg-rf-accent-strong text-white">
                        {editando ? "Guardar" : "Crear mesa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogMesa;
