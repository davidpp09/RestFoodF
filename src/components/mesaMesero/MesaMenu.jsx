import { Plus, UtensilsCrossed, Star, Fish, GlassWater, Cookie } from 'lucide-react';

const CATEGORIA_ICON = {
    "Comida":         UtensilsCrossed,
    "Especialidades": Star,
    "Mariscos":       Fish,
    "Bebidas":        GlassWater,
    "Antojitos":      Cookie,
};

const MesaMenu = ({ productos, categorias, categoriaActiva, setCategoriaActiva, onAgregar, tema }) => {
    const productosFiltrados = productos.filter(p => p.categoria === categoriaActiva);

    return (
        <div className="space-y-4 overflow-hidden flex flex-col h-full min-h-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">MENÚ</p>

            {/* Tabs de categorías */}
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

            {/* Grid de productos */}
            <div className="grid grid-cols-3 gap-3 overflow-y-auto flex-1 pr-2 content-start">
                {productosFiltrados.length === 0 ? (
                    <div className="col-span-3 flex flex-col items-center justify-center py-12 text-slate-600">
                        <UtensilsCrossed size={32} className="mb-2 opacity-30" />
                        <p className="text-sm">Sin productos en esta categoría</p>
                    </div>
                ) : (
                    productosFiltrados.map((producto) => {
                        const Icon = CATEGORIA_ICON[producto.categoria] ?? UtensilsCrossed;
                        return (
                            <button
                                key={producto.id_producto}
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
                                <p className="text-xs text-slate-500 mb-2 line-clamp-1">{producto.descripcion}</p>
                                <p className={`text-base font-black ${tema.text}`}>${producto.precio.toFixed(2)}</p>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MesaMenu;
