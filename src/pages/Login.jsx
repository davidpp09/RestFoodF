import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Utensils } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const { loginUser, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(email, pass);
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-[#020617] p-4">
            {/* Card Principal */}
            <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

                {/* Header con Logo */}
                <div className="p-8 pb-6 border-b border-slate-800/50">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="bg-orange-600 p-3 rounded-xl shadow-lg shadow-orange-900/20">
                            <Utensils size={28} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">RESTFOOD</span>
                    </div>
                    <p className="text-center text-slate-400 text-sm mt-3">Ingresa tus credenciales para continuar</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 text-sm font-semibold">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl focus-visible:ring-orange-600/50 focus-visible:border-orange-600/50"
                                required
                            />
                        </div>

                        {/* Password con Ojito */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300 text-sm font-semibold">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={mostrarPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl pr-12 focus-visible:ring-orange-600/50 focus-visible:border-orange-600/50"
                                    required
                                />
                                {/* 👁️ Ojito para mostrar/ocultar */}
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-500 hover:text-orange-500 transition-colors"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                >
                                    {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de Login */}
                    <Button
                        type="submit"
                        className="w-full mt-8 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Iniciando sesión...</span>
                            </div>
                        ) : (
                            "Iniciar Sesión"
                        )}
                    </Button>

                    {/* Link de recuperación */}
                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-slate-400 hover:text-orange-500 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}