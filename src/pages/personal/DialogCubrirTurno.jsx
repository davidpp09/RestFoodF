import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { mesaService } from "@/services/mesaService";
import SelectorMesera from "./SelectorMesera";

/**
 * Pasa TODAS las mesas de una mesera a otra, p. ej. cuando una falta.
 * Las cuentas que ya estén abiertas siguen siendo de quien las abrió: esa
 * mesera las sigue viendo en su tablet hasta cobrarlas.
 */
const DialogCubrirTurno = ({ abierto, onCerrar, meseras, mesasPorUsuario, deInicial, onHecho }) => {
    const [de, setDe] = useState(deInicial != null ? String(deInicial) : null);
    const [a, setA] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const cuantas = de ? (mesasPorUsuario[Number(de)]?.length ?? 0) : 0;
    const nombre = (id) => meseras.find(m => String(m.id_usuarios) === id)?.nombre;

    const confirmar = async () => {
        setGuardando(true);
        try {
            const { mesas_movidas } = await mesaService.cubrirTurno(Number(de), Number(a));
            toast.success(`${mesas_movidas} mesas pasaron de ${nombre(de)} a ${nombre(a)}`);
            onHecho?.();
            onCerrar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || "No se pudo cubrir el turno");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={(v) => !v && onCerrar()}>
            <DialogContent className="bg-rf-surface border-rf-border text-rf-text sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Cubrir turno</DialogTitle>
                    <DialogDescription className="text-rf-text-2">
                        Todas las mesas de una mesera pasan a otra. Las cuentas ya abiertas las sigue cobrando quien las abrió.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label>Mesas de</Label>
                        <SelectorMesera meseras={meseras} value={de} onChange={setDe} />
                    </div>
                    <div className="flex items-center gap-2 text-rf-text-3 text-xs pl-1">
                        <ArrowDown size={14} />
                        {de ? `${cuantas} mesas` : "—"}
                    </div>
                    <div className="grid gap-2">
                        <Label>Pasan a</Label>
                        <SelectorMesera meseras={meseras} value={a} onChange={setA} excluir={de ? Number(de) : undefined} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} className="flex-1 bg-transparent border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2">
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmar}
                        disabled={!de || !a || cuantas === 0 || guardando}
                        className="flex-1 bg-rf-accent hover:bg-rf-accent-strong text-white"
                    >
                        Pasar {cuantas > 0 ? cuantas : ""} mesas
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogCubrirTurno;
