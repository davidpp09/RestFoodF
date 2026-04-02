import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import axios from 'axios';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email: email,
                contrasena: pass
            });
            const token = response.data.jwTtoken;
            localStorage.setItem('token_restfood', token);
            console.log(token)

            const decoded = jwtDecode(token);

            // OJO: Aquí 'rol' debe ser el nombre exacto que configuraste en Spring Boot
            const rol = decoded.role

            const rutasPorRol = {
                DEV: "/admin-dashboard",
                MESERO: "/pedidos",
                COCINA: "/cocina-panel",
                REPARTIDOR: "/entregas"
            };

            const destino = rutasPorRol[rol] || "/login";

            toast.success(`¡Bienvenido! Entrando como ${rol}`);
            navigate(destino); // 4. ¡Hacer el cambio de página!

        } catch (error) {
            const mensajeError = error.response?.data?.message || "Error al iniciar sesión";
            toast.error(mensajeError);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>INICIAR SESIÓN</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Input
                            type="email"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSubmit}>Entrar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}