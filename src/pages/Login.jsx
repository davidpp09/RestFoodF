import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card"

export default function Login({ email, setEmail, pass, setPass }) {

    const handleSubmit = () => {
        console.log("Intentando iniciar sesión con:", email, pass);
        // Aquí es donde luego pondrás la lógica para validar o enviar a una API
    };
    return (

        <div className="flex min-h-screen  justify-center items-center">
            <Card className="w-full max-w-md" >
                <CardHeader >
                    <CardTitle>INICIAR SESION</CardTitle>
                    <CardDescription></CardDescription>
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
                            placeholder="contrasena"
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