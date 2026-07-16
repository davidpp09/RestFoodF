import { Button } from "@/components/ui/button";
import { KeyRound, Pencil, Trash2 } from "lucide-react";

const coloresRoles = {
    ADMIN: "text-rf-red-ink bg-rf-red-soft",
    MESERO: "text-rf-blue-ink bg-rf-blue-soft",
    COCINA: "text-rf-accent-ink bg-rf-accent-soft",
    CAJERO: "text-rf-green-ink bg-rf-green-soft",
    DEV: "text-violet-700 bg-violet-500/10 dark:text-violet-300",
    REPARTIDOR: "text-rf-cyan-ink bg-rf-cyan-soft",
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
            const estilo = coloresRoles[rol] || "text-rf-text-3 bg-rf-surface-2";

            return (
                <span className={`inline-flex items-center h-[22px] px-2 rounded-[3px] text-[11px] font-bold tracking-[.02em] ${estilo}`}>
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
                        className="h-8 w-8 p-0 hover:bg-rf-blue-soft hover:text-rf-blue-ink"
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.options.meta?.onPassword(usuario)}
                        className="h-8 w-8 p-0 hover:bg-rf-accent-soft hover:text-rf-accent-ink"
                        title="Cambiar contraseña"
                    >
                        <KeyRound size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.options.meta?.onDelete(usuario)}
                        className="h-8 w-8 p-0 hover:bg-rf-red-soft hover:text-rf-red-ink"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            );
        }
    }
];