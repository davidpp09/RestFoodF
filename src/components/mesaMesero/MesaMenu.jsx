import { Plus, UtensilsCrossed, Search, X } from 'lucide-react';
import { CATEGORIA_ICON } from './constants';

const MesaMenu = ({
    productosFiltrados,
    categorias,
    categoriaActiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    onAgregar,
    precioSegunTurno,
    tema,
}) => (
    <div className="overflow-hidden flex flex-col h-full min-h-0 gap-3">
        <p className="text-xs font-bold text-rf-text-3 uppercase tracking-widest">MENÚ</p>

        {/* Barra de búsqueda */}
        <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rf-text-3 pointer-events-none" />
            <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full bg-rf-surface border border-rf-border-strong rounded-md pl-9 pr-10 py-3 text-base text-rf-text placeholder:text-rf-text-3 outline-none focus:border-rf-turno transition-colors"
            />
            {busqueda && (
                <button
                    type="button"
                    onClick={() => setBusqueda("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 text-rf-text-3 hover:text-rf-text-2 transition-colors"
                >
                    <X size={13} />
                </button>
            )}
        </div>

        {/* Tabs de categorías — se ocultan mientras se busca.
            Vertical: fila con scroll horizontal; horizontal: wrap */}
        {!busqueda && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 landscape:flex-wrap landscape:overflow-x-visible landscape:pb-0 landscape:mb-0">
                {categorias.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategoriaActiva(cat)}
                        className={`px-5 py-3 rounded-md font-bold text-base transition-all active:scale-95 shrink-0 whitespace-nowrap
                            ${categoriaActiva === cat
                                ? `${tema.bg} text-white`
                                : "bg-rf-surface border border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        )}

        {/* Contador de resultados al buscar */}
        {busqueda && (
            <p className="text-xs text-rf-text-3">
                {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? "s" : ""} para{" "}
                <span className={`font-bold ${tema.text}`}>"{busqueda}"</span>
            </p>
        )}

        {/* Grid de productos — 2 columnas en vertical, 3 en horizontal */}
        <div className="grid grid-cols-2 landscape:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-2 content-start">
            {productosFiltrados.length === 0 ? (
                <div className="col-span-2 landscape:col-span-3 flex flex-col items-center justify-center py-12 text-rf-text-3">
                    <UtensilsCrossed size={32} className="mb-2 opacity-30" />
                    <p className="text-sm">
                        {busqueda ? "Sin resultados" : "Sin productos en esta categoría"}
                    </p>
                </div>
            ) : (
                productosFiltrados.map((producto) => {
                    const Icon = CATEGORIA_ICON[producto.categoria.nombre] ?? UtensilsCrossed;
                    return (
                        <button
                            key={producto.id}
                            onClick={() => onAgregar(producto)}
                            className={`p-4 bg-rf-surface border border-rf-border rounded-md shadow-rf-sm ${tema.border} transition-all text-left h-fit active:scale-95`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className={`w-11 h-11 rounded-lg ${tema.bgTenue} flex items-center justify-center`}>
                                    <Icon size={22} className={tema.text} />
                                </div>
                                <div className={`w-9 h-9 rounded-lg ${tema.bgTenue} ${tema.bgTenueHover} ${tema.text} hover:text-white flex items-center justify-center transition-all`}>
                                    <Plus size={18} />
                                </div>
                            </div>
                            <p className="text-base font-bold text-rf-text mb-1 line-clamp-2">{producto.nombre}</p>
                            <p className={`text-lg font-bold ${tema.text}`}>
                                ${precioSegunTurno(producto).toFixed(0)}
                            </p>
                        </button>
                    );
                })
            )}
        </div>
    </div>
);

export default MesaMenu;
