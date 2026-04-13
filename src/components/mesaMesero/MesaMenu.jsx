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
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">MENÚ</p>

        {/* Barra de búsqueda */}
        <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-8 pr-8 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-slate-500 transition-colors"
            />
            {busqueda && (
                <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X size={13} />
                </button>
            )}
        </div>

        {/* Tabs de categorías — se ocultan mientras se busca */}
        {!busqueda && (
            <div className="flex gap-2 flex-wrap">
                {categorias.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategoriaActiva(cat)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all
                            ${categoriaActiva === cat
                                ? `${tema.bg} text-slate-950`
                                : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        )}

        {/* Contador de resultados al buscar */}
        {busqueda && (
            <p className="text-xs text-slate-500">
                {productosFiltrados.length} resultado{productosFiltrados.length !== 1 ? "s" : ""} para{" "}
                <span className={`font-bold ${tema.text}`}>"{busqueda}"</span>
            </p>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-3 gap-3 overflow-y-auto flex-1 pr-2 content-start">
            {productosFiltrados.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-slate-600">
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
                            className={`p-3 bg-slate-900/50 border border-slate-800 rounded-2xl ${tema.border} transition-all text-left h-fit active:scale-95`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className={`w-9 h-9 rounded-lg ${tema.bgTenue} flex items-center justify-center`}>
                                    <Icon size={18} className={tema.text} />
                                </div>
                                <div className={`w-7 h-7 rounded-lg ${tema.bgTenue} ${tema.bgTenueHover} ${tema.text} hover:text-slate-950 flex items-center justify-center transition-all`}>
                                    <Plus size={14} />
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-200 mb-1 line-clamp-1">{producto.nombre}</p>
                            <p className={`text-base font-black ${tema.text}`}>
                                ${precioSegunTurno(producto).toFixed(2)}
                            </p>
                        </button>
                    );
                })
            )}
        </div>
    </div>
);

export default MesaMenu;
