import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, UserX, UserCheck, Repeat, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usuarioService } from "@/services/usuarioService";
import { mesaService } from "@/services/mesaService";
import { colorDeMesera, SIN_ASIGNAR } from "./colores";
import RolBadge from "./RolBadge";
import { porNumero } from "./orden";

const pesos = (n) => `$${Number(n ?? 0).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// Desde cuándo cuenta cada tarjeta. Sin esto, a inicio de mes "Este mes" sale
// menor que "Esta semana" (la semana arrancó el lunes, en el mes anterior) y
// parece un error.
const desde = (fecha) => fecha.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
const inicioSemana = (hoy) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
};

const Periodo = ({ titulo, inicio, datos }) => {
    const promedio = datos?.ordenes ? datos.total / datos.ordenes : 0;
    return (
        <div className="p-3 rounded-lg bg-rf-bg border border-rf-border">
            <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-rf-text-3">{titulo}</p>
            {inicio && <p className="text-[11px] text-rf-text-3">desde {inicio}</p>}
            <p className="text-2xl font-bold font-mono text-rf-text mt-1">{datos ? pesos(datos.total) : "—"}</p>
            <p className="text-xs text-rf-text-3 mt-0.5">
                {datos
                    ? `${plural(datos.ordenes, "cuenta", "cuentas")}${datos.ordenes ? ` · ticket ${pesos(promedio)}` : ""}`
                    : "\u00a0"}
            </p>
        </div>
    );
};

const Ventas = ({ idUsuario }) => {
    const [ventas, setVentas] = useState(null);
    const [error, setError] = useState(false);
    const [hoy] = useState(() => new Date());

    useEffect(() => {
        let vigente = true;
        usuarioService.ventas(idUsuario)
            .then(datos => vigente && setVentas(datos))
            .catch(() => vigente && setError(true));
        return () => { vigente = false; };
    }, [idUsuario]);

    if (error) return <p className="text-sm text-rf-red-ink">No se pudieron cargar las ventas.</p>;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
                <Periodo titulo="Hoy" datos={ventas?.hoy} />
                <Periodo titulo="Esta semana" inicio={desde(inicioSemana(hoy))} datos={ventas?.semana} />
                <Periodo titulo="Este mes" inicio={desde(new Date(hoy.getFullYear(), hoy.getMonth(), 1))} datos={ventas?.mes} />
            </div>
            {ventas && (
                <p className="text-xs text-rf-text-3">
                    Platillos cancelados este mes: <span className="font-mono font-semibold text-rf-text-2">{ventas.platillos_cancelados_mes}</span>
                    {" "}· Solo cuentas cobradas, igual que el corte del día.
                </p>
            )}
        </div>
    );
};

/**
 * Las mesas de la mesera. Se tocan para agregar o quitar y se guarda al final:
 * las que se agregan se le quitan a su dueña anterior, las que se quitan quedan
 * sin asignar (y se avisa, porque nadie las vería).
 */
const MesasDeMesera = ({ mesera, mesas, meseras, onGuardado }) => {
    const activas = useMemo(() => mesas.filter(m => m.activa).sort(porNumero), [mesas]);
    const originales = useMemo(
        () => new Set(activas.filter(m => m.id_usuario_asignado === mesera.id_usuarios).map(m => m.id_mesa)),
        [activas, mesera.id_usuarios]
    );
    const [seleccion, setSeleccion] = useState(originales);
    const [guardando, setGuardando] = useState(false);

    // Si las mesas se recargan (p. ej. tras guardar), la selección vuelve a la realidad
    const [originalesPrevias, setOriginalesPrevias] = useState(originales);
    if (originales !== originalesPrevias) {
        setOriginalesPrevias(originales);
        setSeleccion(originales);
    }

    const agregadas = activas.filter(m => seleccion.has(m.id_mesa) && !originales.has(m.id_mesa));
    const quitadas = activas.filter(m => !seleccion.has(m.id_mesa) && originales.has(m.id_mesa));
    const deOtras = agregadas.filter(m => m.id_usuario_asignado != null);
    const hayCambios = agregadas.length + quitadas.length > 0;

    const alternar = (id) => setSeleccion(prev => {
        const nueva = new Set(prev);
        if (nueva.has(id)) nueva.delete(id); else nueva.add(id);
        return nueva;
    });

    const guardar = async () => {
        setGuardando(true);
        try {
            if (agregadas.length) await mesaService.asignar(mesera.id_usuarios, agregadas.map(m => m.id_mesa));
            if (quitadas.length) await mesaService.asignar(null, quitadas.map(m => m.id_mesa));
            toast.success(`Mesas de ${mesera.nombre} actualizadas`);
            await onGuardado();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || "No se pudieron guardar las mesas");
        } finally {
            setGuardando(false);
        }
    };

    const color = colorDeMesera(meseras, mesera.id_usuarios);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {activas.map(m => {
                    const mia = seleccion.has(m.id_mesa);
                    const otra = !mia && m.id_usuario_asignado != null && m.id_usuario_asignado !== mesera.id_usuarios;
                    const estilo = mia
                        ? color.mesa
                        : otra
                            ? "bg-rf-surface-2 text-rf-text-3 border-transparent"
                            : SIN_ASIGNAR.mesa;
                    return (
                        <button
                            key={m.id_mesa}
                            type="button"
                            onClick={() => alternar(m.id_mesa)}
                            title={otra ? `Es de ${m.nombre_asignado}` : undefined}
                            className={`relative aspect-square rounded-md border-2 text-sm font-bold font-mono select-none active:scale-95 transition-transform ${estilo}`}
                        >
                            {m.numero}
                            {otra && (
                                <span className={`absolute bottom-0.5 right-0.5 size-1.5 rounded-full ${colorDeMesera(meseras, m.id_usuario_asignado).punto}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center gap-2 min-h-10">
                <p className="text-sm text-rf-text-2 flex-1">
                    <span className="font-semibold text-rf-text">{seleccion.size} mesas</span>
                    {agregadas.length > 0 && <> · +{agregadas.length}</>}
                    {deOtras.length > 0 && <> (se le quitan a {[...new Set(deOtras.map(m => m.nombre_asignado))].join(", ")})</>}
                    {quitadas.length > 0 && <> · −{quitadas.length} <span className="text-rf-red-ink">quedan sin asignar</span></>}
                </p>
                {hayCambios && (
                    <>
                        <Button variant="ghost" onClick={() => setSeleccion(originales)} disabled={guardando} className="h-9">
                            Deshacer
                        </Button>
                        <Button onClick={guardar} disabled={guardando} className="h-9 bg-rf-accent hover:bg-rf-accent-strong text-white">
                            Guardar mesas
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

const Seccion = ({ titulo, children }) => (
    <section className="space-y-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[.12em] text-rf-text-3">{titulo}</h3>
        {children}
    </section>
);

const FichaEmpleado = ({ usuario, abierto, onCerrar, mesas, meseras, recargar, onEditar, onContrasena, onBaja, onCubrir }) => {
    const [reactivando, setReactivando] = useState(false);
    if (!usuario) return null;

    const esMesera = usuario.rol === "MESERO";
    const activo = Boolean(usuario.estatus);
    const susMesas = mesas.filter(m => m.activa && m.id_usuario_asignado === usuario.id_usuarios);

    const reactivar = async () => {
        setReactivando(true);
        try {
            await usuarioService.activarUsuario(usuario.id_usuarios);
            toast.success(`${usuario.nombre} está activo otra vez`);
            await recargar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || "No se pudo reactivar");
        } finally {
            setReactivando(false);
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={(v) => !v && onCerrar()}>
            <DialogContent className="bg-rf-surface border-rf-border text-rf-text sm:max-w-[640px] max-h-[92vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`size-12 shrink-0 rounded-full flex items-center justify-center text-lg font-bold ${
                            esMesera && activo ? colorDeMesera(meseras, usuario.id_usuarios).mesa + " border-2" : "bg-rf-surface-2 text-rf-text-2"
                        }`}>
                            {usuario.nombre.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-bold">{usuario.nombre}</DialogTitle>
                            <DialogDescription className="text-rf-text-2 flex items-center gap-2 mt-1">
                                <RolBadge rol={usuario.rol} />
                                <span className="truncate">{usuario.email}</span>
                                {!activo && <span className="text-rf-red-ink font-semibold">· Dado de baja</span>}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-5 py-1">
                    <Seccion titulo="Ventas">
                        <Ventas idUsuario={usuario.id_usuarios} />
                    </Seccion>

                    {esMesera && activo && (
                        <Seccion titulo={`Mesas · toca para agregar o quitar`}>
                            <MesasDeMesera mesera={usuario} mesas={mesas} meseras={meseras} onGuardado={recargar} />
                        </Seccion>
                    )}

                    <Seccion titulo="Acciones">
                        <div className="flex flex-wrap gap-2">
                            {activo ? (
                                <>
                                    <Button variant="outline" onClick={onEditar} className="h-10 border-rf-border-strong">
                                        <Pencil size={16} /> Editar datos
                                    </Button>
                                    <Button variant="outline" onClick={onContrasena} className="h-10 border-rf-border-strong">
                                        <KeyRound size={16} /> Cambiar contraseña
                                    </Button>
                                    {esMesera && susMesas.length > 0 && (
                                        <Button variant="outline" onClick={onCubrir} className="h-10 border-rf-border-strong">
                                            <Repeat size={16} /> Cubrir su turno
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={onBaja} className="h-10 border-rf-border-strong hover:bg-rf-red-soft hover:text-rf-red-ink">
                                        <UserX size={16} /> Dar de baja
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={reactivar} disabled={reactivando} className="h-10 bg-rf-green hover:bg-rf-green/90 text-white">
                                    {reactivando ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />} Reactivar
                                </Button>
                            )}
                        </div>
                    </Seccion>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FichaEmpleado;
