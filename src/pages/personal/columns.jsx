// src/pages/personal/columns.jsx
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
    {
        accessorKey: "estatus", 
        header: "Estado",
        cell: ({ row }) => {
            // Obtenemos el valor real desde el campo 'estatus'
            const esActivo = row.getValue("estatus");

            return (
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${esActivo ? "bg-emerald-500" : "bg-slate-500"}`} />
                    <span className="text-sm text-slate-400">
                        {esActivo ? "Activo" : "Inactivo"}
                    </span>
                </div>
            );
        },
    },
];