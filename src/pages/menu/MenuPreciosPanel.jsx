import { AlertTriangle, BookOpen, RefreshCw, Search, Pencil, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useMenuPrecios } from '@/hooks/useMenuPrecios';

const dinero = valor => valor == null ? 'Sin precio' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
const fecha = valor => new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(valor));
const boton = 'min-h-11 rounded-lg border border-rf-border px-4 py-2 font-medium transition-colors disabled:opacity-50';

export default function MenuPreciosPanel() {
    const menu = useMenuPrecios();
    return (
        <section className="h-full overflow-y-auto bg-rf-bg p-4 md:p-6">
            <div className="mx-auto max-w-[1500px] space-y-5">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-rf-accent-ink">Carta del restaurante</p>
                        <h1 className="flex items-center gap-2 text-2xl font-bold"><BookOpen size={25} /> Menú y precios</h1>
                        <p className="mt-2 max-w-xl text-sm text-rf-text-2">Toca un precio del menú para editarlo. Si representa varios platillos, todos cambiarán juntos.</p>
                    </div>
                    <button className={boton + ' flex items-center gap-2 hover:bg-rf-surface-2'} onClick={menu.recargar} disabled={menu.cargando || menu.guardando}>
                        <RefreshCw size={17} className={menu.cargando ? 'animate-spin' : ''} /> Actualizar
                    </button>
                </header>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2" aria-label="Página del menú">
                        {[1, 2].map(pagina => <button key={pagina} aria-pressed={menu.pagina === pagina}
                            className={boton + (menu.pagina === pagina ? ' bg-rf-accent text-white border-transparent' : ' bg-rf-surface')}
                            onClick={() => menu.setPagina(pagina)} disabled={menu.guardando}>
                            {pagina === 1 ? 'Desayunos' : 'Comidas'}
                        </button>)}
                    </div>
                    <Link to="/entregas/dia" className="text-sm font-medium text-rf-accent-ink underline underline-offset-4">Editar la comida del día</Link>
                </div>

                {menu.aviso && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-rf-text">{menu.aviso}</p>}
                {menu.error && <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4"><p>{menu.error}</p><button onClick={menu.recargar} className={boton + ' mt-3'}>Volver a intentar</button></div>}
                {!menu.cargando && menu.pendientes.length > 0 && <div role="status" className="flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
                    <AlertTriangle className="shrink-0 text-amber-500" size={21} />
                    <p><strong>{menu.pendientes.length} grupos por revisar.</strong> El ámbar indica precios distintos, precios pendientes o grupos incompletos. Unifica los importes y completa los platillos faltantes del catálogo antes de imprimir.</p>
                </div>}

                <div className="flex flex-wrap items-center gap-2">
                    <button className={boton + (menu.vista === 'menu' ? ' bg-rf-accent-soft text-rf-accent-ink' : '')} aria-pressed={menu.vista === 'menu'} onClick={() => menu.setVista('menu')}>Ver menú</button>
                    <button className={boton + (menu.vista === 'lista' ? ' bg-rf-accent-soft text-rf-accent-ink' : '')} aria-pressed={menu.vista === 'lista'} onClick={() => menu.setVista('lista')}>Buscar en lista</button>
                    {menu.vista === 'menu' && <button className={boton + ' ml-auto text-sm'} onClick={() => menu.setHojaCompleta(v => !v)}>{menu.hojaCompleta ? 'Ampliar una copia' : 'Ver hoja completa'}</button>}
                </div>
                <div className={menu.vista === 'menu' ? 'grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]' : 'mx-auto max-w-3xl'}>
                    <div className={(menu.vista === 'menu' ? '' : 'hidden ') + 'overflow-x-auto rounded-xl border border-rf-border bg-rf-surface p-2 md:p-3'} aria-busy={menu.cargando}>
                        {menu.cargando ? <div className="flex min-h-96 items-center justify-center gap-3 text-rf-text-2" role="status"><RefreshCw className="animate-spin" size={22} /> Preparando vista del menú…</div>
                            : menu.imagen && !menu.error && <div className={menu.hojaCompleta ? 'mx-auto min-w-[640px] max-w-[1050px]' : 'mx-auto max-w-[620px] overflow-hidden'}><div className={menu.hojaCompleta ? 'relative w-full bg-white' : 'relative w-[200%] bg-white'}>
                                <img src={menu.imagen} alt={`Menú de ${menu.pagina === 1 ? 'desayunos' : 'comidas'}, con precios actuales`} className="block h-auto w-full" />
                                {menu.entradas.flatMap((entrada, indice) => entrada.cajas.map((caja, copia) => {
                                    if (!menu.hojaCompleta && caja.x >= menu.mapa.anchoPagina / 2) return null;
                                    const grupo = menu.porClave[entrada.clave];
                                    const incompleto = !grupo?.productos.length || !!grupo?.faltantes?.length;
                                    const pendiente = grupo?.mixto || incompleto || grupo?.precio == null;
                                    return <button key={`${indice}-${copia}`} type="button" onClick={() => menu.abrir(entrada.clave)}
                                        aria-label={`Editar ${entrada.nombre}: ${incompleto ? 'grupo incompleto' : grupo?.mixto ? 'precios distintos' : dinero(grupo?.precio)}`}
                                        title={`${entrada.nombre} · ${incompleto ? 'Grupo incompleto' : grupo?.mixto ? 'Precios distintos' : dinero(grupo?.precio)}`}
                                        className={`absolute rounded-sm border transition-colors focus:z-10 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 ${pendiente ? 'border-amber-600 bg-amber-300/30' : 'border-blue-500/30 bg-blue-400/10 hover:border-blue-600 hover:bg-blue-400/25'}`}
                                        style={{ left: `${caja.x / menu.mapa.anchoPagina * 100}%`, top: `${caja.y / menu.mapa.altoPagina * 100}%`, width: `${caja.ancho / menu.mapa.anchoPagina * 100}%`, height: `${caja.alto / menu.mapa.altoPagina * 100}%` }} />;
                                }))}
                            </div></div>}
                        <p className="mt-3 text-center text-xs text-rf-text-2">Toca un importe resaltado o usa «Buscar en lista» para elegir un platillo.</p>
                        <p className="mt-2 text-center text-xs text-rf-text-2">El signo <strong className="text-red-600">!</strong> rojo indica que el importe no cabe de forma legible. Ajusta el precio.</p>
                    </div>

                    <aside className={(menu.vista === 'menu' ? 'hidden xl:block ' : '') + 'rounded-xl border border-rf-border bg-rf-surface p-4'}>
                        <h2 className="text-lg font-semibold">Elegir un precio</h2>
                        <label className="mt-3 flex items-center gap-2 rounded-lg border border-rf-border bg-rf-bg px-3">
                            <Search size={18} className="text-rf-text-2" />
                            <input aria-label="Buscar platillo o grupo" placeholder="Buscar un platillo…" value={menu.busqueda} onChange={e => menu.setBusqueda(e.target.value)} className="min-h-11 w-full min-w-0 bg-transparent text-sm outline-none" />
                        </label>
                        <div className="mt-3 max-h-[65vh] space-y-2 overflow-y-auto">
                            {menu.visibles.map(grupo => <button key={grupo.clave} disabled={menu.cargando || !!menu.error} onClick={() => menu.abrir(grupo.clave)}
                                className="flex min-h-14 w-full items-center justify-between gap-3 rounded-lg border border-rf-border p-3 text-left hover:bg-rf-surface-2 disabled:opacity-50">
                                <span className="min-w-0"><span className="block text-sm font-medium">{grupo.nombre}</span><span className="text-xs text-rf-text-2">{grupo.productos.length} {grupo.productos.length === 1 ? 'platillo' : 'platillos'}</span></span>
                                <span className={`shrink-0 text-sm font-bold ${grupo.mixto || !grupo.productos.length || grupo.faltantes?.length || grupo.precio == null ? 'text-amber-500' : 'text-rf-accent-ink'}`}>{!grupo.productos.length || grupo.faltantes?.length ? 'Incompleto' : grupo.mixto ? 'Distintos' : dinero(grupo.precio)}</span>
                            </button>)}
                            {!menu.cargando && menu.visibles.length === 0 && <p className="py-5 text-sm text-rf-text-2">No hay resultados para esa búsqueda.</p>}
                        </div>
                    </aside>
                </div>
            </div>

            <Dialog open={!!menu.grupo} onOpenChange={abierto => { if (!abierto) menu.cerrar(); }}>
                <DialogContent className="max-h-[90dvh] overflow-y-auto border-rf-border bg-rf-surface text-rf-text sm:max-w-lg" showCloseButton={!menu.guardando}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Pencil size={19} /> {menu.grupo?.nombre}</DialogTitle>
                        <DialogDescription className="text-rf-text-2">Precio de {menu.grupo?.campo === 'DESAYUNO' ? 'desayuno' : 'comida'}. El cambio se guarda para todos los platillos de este grupo.</DialogDescription>
                    </DialogHeader>
                    {menu.grupo?.mixto && <p role="alert" className="rounded-lg bg-amber-500/15 p-3 text-sm">Estos platillos tienen precios distintos. Al guardar, todos tendrán el nuevo importe.</p>}
                    {(menu.grupo?.productos.length === 0 || !!menu.grupo?.faltantes?.length) && <div role="alert" className="space-y-2 rounded-lg bg-amber-500/15 p-3 text-sm">
                        <p className="font-semibold">Completa este grupo antes de guardar un precio.</p>
                        {!!menu.grupo?.faltantes?.length && <><p>Platillos faltantes:</p><ul className="list-disc pl-5">{menu.grupo.faltantes.map(nombre => <li key={nombre}>{nombre}</li>)}</ul></>}
                        <p>Crea o restaura {menu.grupo?.faltantes?.length ? 'los platillos con estos nombres' : 'los platillos de este grupo'} en <Link to="/admin/platillos" className="underline">Platillos</Link>. Se asociarán automáticamente al grupo. Después vuelve aquí y pulsa Actualizar.</p>
                    </div>}
                    {!!menu.grupo?.productos.length && <form onSubmit={menu.guardar} className="space-y-4">
                        <label className="block text-sm font-semibold">Nuevo precio
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-rf-border bg-rf-bg px-4"><span>$</span><input autoFocus aria-label="Nuevo precio" inputMode="decimal" value={menu.precio} onChange={e => menu.setPrecio(e.target.value)} disabled={menu.guardando || !!menu.grupo?.faltantes?.length} className="min-h-12 w-full bg-transparent text-xl font-bold outline-none disabled:opacity-50" /></div>
                        </label>
                        <ul className="max-h-48 divide-y divide-rf-border overflow-y-auto rounded-lg border border-rf-border text-sm">
                            {menu.grupo?.productos.map(p => <li key={p.id} className="flex justify-between gap-3 px-3 py-2"><span>{p.nombre}</span><span className="shrink-0 tabular-nums">{dinero(p.precio)}</span></li>)}
                        </ul>
                        <p className="text-xs text-rf-text-2">Las órdenes abiertas conservan el precio con el que se pidieron.</p>
                        {menu.errorGuardar && <p role="alert" className="text-sm text-red-500">{menu.errorGuardar}</p>}
                        <div className="flex justify-end gap-2"><button type="button" onClick={menu.cerrar} disabled={menu.guardando} className={boton}>Cancelar</button><button type="submit" disabled={menu.guardando || !!menu.grupo?.faltantes?.length} className={boton + ' border-transparent bg-rf-accent text-white'}>{menu.guardando ? 'Guardando…' : 'Guardar precio'}</button></div>
                    </form>}
                    {!!menu.grupo?.productos.length && <details className="border-t border-rf-border pt-3">
                        <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium"><History size={17} /> Historial de precios</summary>
                        <label className="block text-sm">Platillo
                            <select value={menu.productoHistorial} onChange={e => menu.setProductoHistorial(e.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-rf-border bg-rf-bg px-2">
                                <option value="">Seleccionar platillo</option>{menu.grupo.productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </label>
                        {menu.cargandoHistorial ? <p role="status" className="mt-3 text-sm">Cargando historial…</p> : menu.errorHistorial ? <p role="alert" className="mt-3 text-sm text-red-500">{menu.errorHistorial}</p> : menu.productoHistorial && <ul className="mt-3 max-h-52 space-y-3 overflow-y-auto text-sm">
                            {menu.historial.map(h => <li key={h.id} className="rounded-lg bg-rf-bg p-3"><p className="font-medium">{h.precioAnterior == null ? 'Alta' : dinero(h.precioAnterior)} → {dinero(h.precioNuevo)} · {h.campo === 'DESAYUNO' ? 'Desayuno' : 'Comida'}</p><p className="mt-1 text-xs text-rf-text-2">{h.usuario} · {fecha(h.fecha)}</p></li>)}
                            {menu.historial.length === 0 && <li className="text-rf-text-2">Todavía no hay cambios registrados.</li>}
                        </ul>}
                    </details>}
                </DialogContent>
            </Dialog>
        </section>
    );
}
