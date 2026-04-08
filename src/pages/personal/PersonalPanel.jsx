// src/pages/personal/PersonalPanel.jsx
import { usePersonal } from "@/hooks/usePersonal";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { Loader2 } from "lucide-react";

const PersonalPanel = () => {
    const { usuarios, loading } = usePersonal();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-800">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Cargando personal...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestión de Personal 👤</h1>
                    <p className="text-slate-400">Administra los usuarios y roles de tu restaurante</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <DataTable columns={columns} data={usuarios} />
            </div>
        </div>
    );
};

export default PersonalPanel;