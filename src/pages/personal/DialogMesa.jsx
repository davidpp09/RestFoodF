import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mesaService } from "@/services/mesaService";
import SelectorMesera from "./SelectorMesera";

// Mismo tope que el backend (MesaService.MAXIMO_POR_LOTE)
const MAXIMO_POR_LOTE = 50;

const claseInput = "bg-rf-bg border-rf-border-strong h-10 text-lg font-mono";

/**
 * Alta de mesas (una sola o un rango como 51-65), o cambio de número de una
 * existente si llega `mesa`.
 */
const DialogMesa = ({ abierto, onCerrar, mesa, meseras, sugerencia, onHecho }) => {
    const editando = Boolean(mesa);
    const [modo, setModo] = useState("una"); // 'una' | 'lote'
    const [numero, setNumero] = useState(mesa?.numero ?? sugerencia ?? "");
    const [desde, setDesde] = useState(sugerencia ?? "");
    const [hasta, setHasta] = useState("");
    const [mesera, setMesera] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const idMesera = mesera && mesera !== "ninguna" ? Number(mesera) : null;
    const nombreMesera = meseras.find(m => m.id_usuarios === idMesera)?.nombre;

    // Vista previa del lote, o por qué todavía no se puede crear
    const d = Number(desde);
    const h = Number(hasta);
    const cuantas = h - d + 1;
    let problemaLote = null;
    if (!Number.isInteger(d) || !Number.isInteger(h) || d < 1 || h < 1 || desde === "" || hasta === "") {
        problemaLote = "Escribe los dos números del rango.";
    } else if (d > h) {
        problemaLote = `El rango va al revés: ${d} es mayor que ${h}.`;
    } else if (cuantas > MAXIMO_POR_LOTE) {
        problemaLote = `Son ${cuantas} mesas; el máximo por lote es ${MAXIMO_POR_LOTE}.`;
    }

    const guardar = async () => {
        setGuardando(true);
        try {
            if (editando) {
                const valor = numero.trim();
                if (!valor) { toast.error("Escribe el número de la mesa"); return; }
                await mesaService.renombrar(mesa.id_mesa, valor);
                toast.success(`La mesa ${mesa.numero} ahora es la ${valor}`);
            } else if (modo === "lote") {
                if (problemaLote) { toast.error(problemaLote); return; }
                const creadas = await mesaService.crearLote(d, h, idMesera);
                toast.success(`${creadas.length} mesas creadas: de la ${d} a la ${h}`);
            } else {
                const valor = numero.trim();
                if (!valor) { toast.error("Escribe el número de la mesa"); return; }
                await mesaService.crear(valor, idMesera);
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

    const enter = (e) => e.key === "Enter" && guardar();

    return (
        <Dialog open={abierto} onOpenChange={(v) => !v && onCerrar()}>
            <DialogContent className="bg-rf-surface border-rf-border text-rf-text sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{editando ? `Cambiar número de la mesa ${mesa.numero}` : "Nuevas mesas"}</DialogTitle>
                    <DialogDescription className="text-rf-text-2">
                        {editando
                            ? "El historial de cuentas de la mesa se conserva."
                            : "Aparecerán en la tablet de la mesera que elijas."}
                    </DialogDescription>
                </DialogHeader>

                {!editando && (
                    <div className="grid grid-cols-2 p-1 rounded-lg bg-rf-surface-2 border border-rf-border">
                        {[["una", "Una mesa"], ["lote", "Varias (rango)"]].map(([id, etiqueta]) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setModo(id)}
                                className={`h-9 rounded-md text-sm font-semibold transition-colors ${
                                    modo === id ? "bg-rf-surface text-rf-text shadow-rf-sm" : "text-rf-text-2 hover:text-rf-text"
                                }`}
                            >
                                {etiqueta}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid gap-4 py-1">
                    {editando || modo === "una" ? (
                        <div className="grid gap-2">
                            <Label htmlFor="numero-mesa">Número</Label>
                            <Input
                                id="numero-mesa"
                                value={numero}
                                maxLength={10}
                                onChange={(e) => setNumero(e.target.value)}
                                onKeyDown={enter}
                                className={claseInput}
                            />
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="mesa-desde">De la</Label>
                                    <Input id="mesa-desde" inputMode="numeric" value={desde}
                                        onChange={(e) => setDesde(e.target.value.replace(/\D/g, ""))}
                                        onKeyDown={enter} className={claseInput} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mesa-hasta">A la</Label>
                                    <Input id="mesa-hasta" inputMode="numeric" value={hasta} placeholder={desde ? String(Number(desde) + 14) : ""}
                                        onChange={(e) => setHasta(e.target.value.replace(/\D/g, ""))}
                                        onKeyDown={enter} className={claseInput} />
                                </div>
                            </div>
                            <p className={`text-sm ${problemaLote ? "text-rf-text-3" : "text-rf-text-2"}`}>
                                {problemaLote && (desde !== "" && hasta !== "") ? (
                                    <span className="text-rf-red-ink">{problemaLote}</span>
                                ) : problemaLote ? (
                                    "Ejemplo: de la 51 a la 65."
                                ) : (
                                    <>
                                        Se crearán <span className="font-semibold text-rf-text">{cuantas} mesas</span> ({d} a {h})
                                        {nombreMesera ? <> para <span className="font-semibold text-rf-text">{nombreMesera}</span></> : " sin asignar"}.
                                    </>
                                )}
                            </p>
                        </div>
                    )}

                    {!editando && (
                        <div className="grid gap-2">
                            <Label>La{modo === "lote" ? "s" : ""} atiende</Label>
                            <SelectorMesera meseras={meseras} value={mesera} onChange={setMesera} permitirNinguna placeholder="Sin asignar" />
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCerrar} className="flex-1 bg-transparent border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2">
                        Cancelar
                    </Button>
                    <Button
                        onClick={guardar}
                        disabled={guardando || (!editando && modo === "lote" && Boolean(problemaLote))}
                        className="flex-1 bg-rf-accent hover:bg-rf-accent-strong text-white"
                    >
                        {editando ? "Guardar" : modo === "lote" ? (problemaLote ? "Crear mesas" : `Crear ${cuantas} mesas`) : "Crear mesa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogMesa;
