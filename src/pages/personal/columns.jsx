import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const coloresRoles = {
    ADMIN: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    MESERO: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    COCINA: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    CAJERO: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    DEV: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    REPARTIDOR: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

export const columns = [
    {
        accessorKey: "nombre",
        header: "Empleado",
    },
    {
        accessorKey: "email",
        header: "Correo",
    },
    {
        accessorKey: "rol",
        header: "Rol",
        cell: ({ row }) => {
            const rol = row.getValue("rol");
            const estilo = coloresRoles[rol] || "text-slate-500 bg-slate-500/10";

            return (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${estilo}`}>
                    {rol}
                </span>
            );
        },
    },
    // ❌ COLUMNA DE ESTADO ELIMINADA
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row, table }) => {
            const usuario = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.options.meta?.onEdit(usuario)}
                        className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-500"
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.options.meta?.onDelete(usuario)}
                        className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            );
        }
    }
];