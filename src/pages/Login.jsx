import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"


export default function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const { loginUser, loading } = useAuth();

    const handleSubmit = async () => {
        loginUser(email, pass);
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
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Entrar"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}