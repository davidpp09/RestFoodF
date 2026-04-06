// src/components/MesaAdmin.jsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MesaAdmin = ({ id_mesa, estado, nombre_mesero, id_orden, platillos = [] }) => {
    const esOcupada = estado === "OCUPADA";

    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* Este es el "Trigger" (tu cuadrito que ya se adapta a la pantalla) */}
                <div className={`cursor-pointer p-4 border-2 rounded-xl transition-all hover:scale-105 flex flex-col justify-between aspect-video
          ${esOcupada ? "border-red-500 bg-white" : "border-gray-200 bg-gray-50 opacity-60"}`}>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Mesa {id_mesa}</span>
                        <div className={`w-3 h-3 rounded-full ${esOcupada ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
                    </div>
                    {esOcupada && <span className="text-xs text-gray-500 truncate">👤 {nombre_mesero}</span>}
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mesa {id_mesa} - Detalle de Orden</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {esOcupada ? (
                        <>
                            <p className="text-sm text-gray-500 mb-4 font-mono">Orden: #{id_orden}</p>
                            <table className="w-full text-sm mb-6">
                                <thead>
                                    <tr className="border-b text-left text-gray-500">
                                        <th>Cant.</th>
                                        <th>Platillo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {platillos.map((p, i) => (
                                        <tr key={i} className="border-b">
                                            <td>{p.cantidad}</td>
                                            <td>{p.nombre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p className="text-center py-10 text-gray-400">La mesa está libre actualmente.</p>
                    )}
                </div>

                <DialogFooter>
                    {esOcupada && (
                        <Button variant="destructive" className="w-full">
                            Dar la Cuenta 🧾
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MesaAdmin;