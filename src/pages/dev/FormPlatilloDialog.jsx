import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const VACIO = { nombre: '', precio_comida: '', precio_desayuno: '', disponibilidad: true, id_categoria: '' };

// Dialog para crear o editar un platillo. Si recibe `producto` está editando;
// si recibe null está creando. El guardado real lo hace el padre vía onGuardar.
const FormPlatilloDialog = ({ producto, categorias, onGuardar, onCerrar }) => {
    const editando = !!producto?.id;
    const [form, setForm] = useState(
        editando
            ? { nombre: producto.nombre, precio_comida: producto.precioComida, precio_desayuno: producto.precioDesayuno, disponibilidad: producto.disponibilidad, id_categoria: producto.categoria.id }
            : VACIO
    );
    const [guardando, setGuardando] = useState(false);

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleGuardar = async () => {
        if (!form.nombre.trim() || !form.precio_comida || !form.precio_desayuno || !form.id_categoria) {
            toast.error('Completa todos los campos');
            return;
        }
        setGuardando(true);
        try {
            const payload = { ...form, precio_comida: Number(form.precio_comida), precio_desayuno: Number(form.precio_desayuno), id_categoria: Number(form.id_categoria) };
            await onGuardar(payload);
            onCerrar();
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-rf-surface border border-rf-border rounded-lg w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-rf-border">
                    <h2 className="text-lg font-bold text-rf-text">{editando ? 'Editar Platillo' : 'Nuevo Platillo'}</h2>
                    <button onClick={onCerrar} className="text-rf-text-3 hover:text-rf-text transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-rf-text-3 uppercase tracking-widest block mb-1.5">Nombre</label>
                        <input
                            value={form.nombre}
                            onChange={e => set('nombre', e.target.value)}
                            className="w-full bg-rf-bg border border-rf-border-strong rounded-md px-3 py-2.5 text-rf-text text-sm outline-none focus:border-rf-accent transition-colors"
                            placeholder="Ej: Pechuga Empanizada"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-rf-text-3 uppercase tracking-widest block mb-1.5">Precio Comida</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={form.precio_comida}
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                    set('precio_comida', val);
                                }}
                                className="w-full bg-rf-bg border border-rf-border-strong rounded-md px-3 py-2.5 text-rf-text text-sm outline-none focus:border-rf-accent transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-rf-text-3 uppercase tracking-widest block mb-1.5">Precio Desayuno</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={form.precio_desayuno}
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                    set('precio_desayuno', val);
                                }}
                                className="w-full bg-rf-bg border border-rf-border-strong rounded-md px-3 py-2.5 text-rf-text text-sm outline-none focus:border-rf-accent transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-rf-text-3 uppercase tracking-widest block mb-1.5">Categoría</label>
                        <select
                            value={form.id_categoria}
                            onChange={e => set('id_categoria', e.target.value)}
                            className="w-full bg-rf-bg border border-rf-border-strong rounded-md px-3 py-2.5 text-rf-text text-sm outline-none focus:border-rf-accent transition-colors"
                        >
                            <option value="">Selecciona categoría</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => set('disponibilidad', !form.disponibilidad)}
                            className={`w-10 h-6 rounded-full transition-colors relative ${form.disponibilidad ? 'bg-rf-green' : 'bg-rf-border-strong'}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.disponibilidad ? 'left-[18px]' : 'left-0.5'}`} />
                        </button>
                        <span className="text-sm text-rf-text-2 font-semibold">{form.disponibilidad ? 'Disponible' : 'No disponible'}</span>
                    </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <button onClick={onCerrar} className="flex-1 py-2.5 rounded-md border border-rf-border-strong text-rf-text-2 hover:text-rf-text hover:bg-rf-surface-2 text-sm font-bold transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={guardando}
                        className="flex-1 py-2.5 rounded-md bg-rf-accent hover:bg-rf-accent-strong disabled:opacity-50 text-white font-bold text-sm transition-colors"
                    >
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormPlatilloDialog;
