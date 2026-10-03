import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Repeat, Pencil, Archive, ArchiveRestore, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { mesaService } from "@/services/mesaService";
import { colorDeMesera, SIN_ASIGNAR } from "./colores";
import { porNumero } from "./orden";
import SelectorMesera from "./SelectorMesera";
import DialogMesa from "./DialogMesa";
import DialogCubrirTurno from "./DialogCubrirTurno";

/**
 * Todas las mesas, pintadas del color de su mesera.
 *
 * Se tocan las mesas para seleccionarlas y abajo aparece la barra para
 * asignarlas a alguien. Una mesa tiene UNA mesera: asignarla a otra se la quita
 * a la anterior. Con una sola mesa seleccionada también se puede renombrar o
 * dar de baja.
 */
const MapaMesas = ({ mesas, meseras, mesasPorUsuario, mesasSinAsignar, recargar }) => {
    const [seleccion, setSeleccion] = useState(() => new Set());
    const [destino, setDestino] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [verBajas, setVerBajas] = useState(false);
    const [dialogo, setDialogo] = useState(null); // 'nueva' | 'renombrar' | 'cubrir'

    const activas = useMemo(() => mesas.filter(m => m.activa).sort(porNumero), [mesas]);
    const bajas = useMemo(() => mesas.filter(m => !m.activa).sort(porNumero), [mesas]);
    const seleccionadas = activas.filter(m => seleccion.has(m.id_mesa));
    const unica = seleccionadas.length === 1 ? seleccionadas[0] : null;

    // Siguiente número libre como sugerencia al crear (51 si van de 1 a 50)
    const sugerencia = useMemo(() => {
        const numeros = mesas.map(m => Number(m.numero)).filter(Number.isFinite);
        return numeros.length ? String(Math.max(...numeros) + 1) : "1";
    }, [mesas]);

    const alternar = (id) => {
        setSeleccion(prev => {
            const nueva = new Set(prev);
            if (nueva.has(id)) nueva.delete(id); else nueva.add(id);
            return nueva;
        });
    };

    const limpiar = () => {
        setSeleccion(new Set());
        setDestino(null);
    };

    const despues = async (promesa, mensaje) => {
        setGuardando(true);
        try {
            await promesa;
            toast.success(mensaje);
            limpiar();
            await recargar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || "No se pudo completar la acción");
        } finally {
            setGuardando(false);
        }
    };

    const asignar = () => {
        const idUsuario = destino === "ninguna" ? null : Number(destino);
        const nombre = idUsuario ? meseras.find(m => m.id_usuarios === idUsuario)?.nombre : null;
        despues(
            mesaService.asignar(idUsuario, seleccionadas.map(m => m.id_mesa)),
            nombre ? `${seleccionadas.length} mesas asignadas a ${nombre}` : `${seleccionadas.length} mesas quedaron sin asignar`
        );
    };

    // Las que se le quitarían a otra mesera: se avisa antes de confirmar
    const quitadas = destino && destino !== "ninguna"
        ? seleccionadas.filter(m => m.id_usuario_asignado != null && m.id_usuario_asignado !== Number(destino))
        : [];

    return (
        <div className="space-y-4 pb-28">
            {/* Leyenda + acciones */}
            <div className="flex flex-wrap items-center gap-2">
                {meseras.map(m => (
                    <span key={m.id_usuarios} className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-rf-surface border border-rf-border text-sm">
                        <span className={`size-2.5 rounded-full ${colorDeMesera(meseras, m.id_usuarios).punto}`} />
                        <span className="font-semibold text-rf-text">{m.nombre}</span>
                        <span className="font-mono text-rf-text-3">{mesasPorUsuario[m.id_usuarios]?.length ?? 0}</span>
                    </span>
                ))}
                <span className={`inline-flex items-center gap-2 h-8 px-3 rounded-full border text-sm ${
                    mesasSinAsignar.length ? "bg-rf-red-soft border-rf-red text-rf-red-ink" : "bg-rf-surface border-rf-border text-rf-text-3"
                }`}>
                    {mesasSinAsignar.length > 0 && <AlertTriangle size={14} />}
                    Sin asignar <span className="font-mono">{mesasSinAsignar.length}</span>
                </span>

                <div className="ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => setDialogo("cubrir")} className="h-9 border-rf-border-strong">
                        <Repeat size={16} /> Cubrir turno
                    </Button>
                    <Button onClick={() => setDialogo("nueva")} className="h-9 bg-rf-accent hover:bg-rf-accent-strong text-white">
                        <Plus size={16} /> Nueva mesa
                    </Button>
                </div>
            </div>

            {mesasSinAsignar.length > 0 && (
                <p className="text-sm text-rf-red-ink">
                    Las mesas sin asignar no le aparecen a ninguna mesera; solo el encargado puede abrirlas.
                </p>
            )}

            {/* Mapa */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                {activas.map(m => {
                    const color = m.id_usuario_asignado != null ? colorDeMesera(meseras, m.id_usuario_asignado) : SIN_ASIGNAR;
                    const elegida = seleccion.has(m.id_mesa);
                    return (
                        <button
                            key={m.id_mesa}
                            type="button"
                            onClick={() => alternar(m.id_mesa)}
                            className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center select-none transition-transform active:scale-95 ${color.mesa} ${
                                elegida ? "ring-4 ring-rf-text/70 ring-offset-2 ring-offset-rf-bg scale-[1.03]" : ""
                            }`}
                        >
                            <span className="text-xl font-bold font-mono leading-none">{m.numero}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wide mt-1 max-w-full truncate px-1 opacity-80">
                                {m.nombre_asignado ?? "—"}
                            </span>
                            {m.estado === "OCUPADA" && (
                                <span className="absolute top-1 right-1 size-2 rounded-full bg-rf-red" title="Cuenta abierta" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Mesas dadas de baja */}
            {bajas.length > 0 && (
                <div className="pt-2">
                    <button type="button" onClick={() => setVerBajas(v => !v)} className="text-sm text-rf-text-2 hover:text-rf-text underline underline-offset-4">
                        {verBajas ? "Ocultar" : "Ver"} mesas dadas de baja ({bajas.length})
                    </button>
                    {verBajas && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {bajas.map(m => (
                                <div key={m.id_mesa} className="flex items-center gap-2 h-10 pl-3 pr-1 rounded-lg border border-dashed border-rf-border-strong bg-rf-surface text-rf-text-3">
                                    <span className="font-mono font-bold">{m.numero}</span>
                                    <Button
                                        variant="ghost" size="sm" disabled={guardando}
                                        onClick={() => despues(mesaService.reactivar(m.id_mesa), `Mesa ${m.numero} reactivada`)}
                                        className="h-8 text-rf-green-ink hover:bg-rf-green-soft"
                                    >
                                        <ArchiveRestore size={15} /> Reactivar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Barra de acciones de la selección */}
            {seleccionadas.length > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(760px,calc(100%-2rem))] rounded-xl bg-rf-surface border border-rf-border-strong shadow-rf-lg p-3 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-rf-text">
                            {seleccionadas.length === 1 ? `Mesa ${unica.numero}` : `${seleccionadas.length} mesas`}
                        </span>
                        <div className="flex-1 min-w-[180px]">
                            <SelectorMesera meseras={meseras} value={destino} onChange={setDestino} permitirNinguna placeholder="Asignar a…" />
                        </div>
                        <Button onClick={asignar} disabled={!destino || guardando} className="h-10 bg-rf-accent hover:bg-rf-accent-strong text-white">
                            Asignar
                        </Button>
                        {unica && (
                            <>
                                <Button variant="outline" onClick={() => setDialogo("renombrar")} className="h-10 border-rf-border-strong" title="Cambiar número">
                                    <Pencil size={16} />
                                </Button>
                                <Button
                                    variant="outline" disabled={guardando}
                                    onClick={() => despues(mesaService.darDeBaja(unica.id_mesa), `Mesa ${unica.numero} dada de baja`)}
                                    className="h-10 border-rf-border-strong hover:bg-rf-red-soft hover:text-rf-red-ink" title="Dar de baja"
                                >
                                    <Archive size={16} />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" onClick={limpiar} className="h-10" title="Quitar selección">
                            <X size={18} />
                        </Button>
                    </div>
                    {quitadas.length > 0 && (
                        <p className="text-xs text-rf-text-2">
                            Se le quitan a: {[...new Set(quitadas.map(m => m.nombre_asignado))].join(", ")}.
                        </p>
                    )}
                </div>
            )}

            {dialogo === "nueva" && (
                <DialogMesa abierto onCerrar={() => setDialogo(null)} meseras={meseras} sugerencia={sugerencia} onHecho={recargar} />
            )}
            {dialogo === "renombrar" && unica && (
                <DialogMesa abierto onCerrar={() => setDialogo(null)} mesa={unica} meseras={meseras} onHecho={() => { limpiar(); recargar(); }} />
            )}
            {dialogo === "cubrir" && (
                <DialogCubrirTurno abierto onCerrar={() => setDialogo(null)} meseras={meseras} mesasPorUsuario={mesasPorUsuario} onHecho={recargar} />
            )}
        </div>
    );
};

export default MapaMesas;
