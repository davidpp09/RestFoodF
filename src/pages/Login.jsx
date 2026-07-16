import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../components/ThemeToggle';
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
        <div className="relative flex min-h-screen justify-center items-center bg-rf-bg p-6">
            <ThemeToggle className="absolute top-4 right-4 shadow-rf-sm" />
            {/* Card Principal */}
            <div className="w-full max-w-md bg-rf-surface border border-rf-border rounded-xl shadow-rf-md overflow-hidden">

                {/* Header con Logo */}
                <div className="px-8 pt-9 pb-7 flex flex-col items-center gap-3.5 text-center">
                    <div className="flex size-14 items-center justify-center rounded-md bg-rf-accent text-white">
                        <Utensils size={26} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[22px] font-bold tracking-[.18em] text-rf-text">RESTFOOD</span>
                        <p className="text-sm text-rf-text-2">Ingresa tus credenciales para continuar</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8">
                    <div className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-rf-text-2 text-sm font-semibold">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-md bg-rf-bg border-rf-border-strong text-rf-text placeholder:text-rf-text-3"
                                required
                            />
                        </div>

                        {/* Password con Ojito */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-rf-text-2 text-sm font-semibold">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={mostrarPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    className="h-12 rounded-md bg-rf-bg border-rf-border-strong text-rf-text placeholder:text-rf-text-3 pr-12"
                                    required
                                />
                                {/* 👁️ Ojito para mostrar/ocultar */}
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-rf-text-3 hover:text-rf-text-2 transition-colors"
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
                        className="w-full mt-8 h-13 bg-rf-accent hover:bg-rf-accent-strong text-white text-base font-bold rounded-md shadow-rf-sm transition-all active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <a href="#" className="text-sm font-medium text-rf-accent-ink hover:text-rf-accent-strong transition-colors">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
