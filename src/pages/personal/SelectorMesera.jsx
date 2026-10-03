import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { colorDeMesera, SIN_ASIGNAR } from "./colores";

// El Select de base-ui pinta el valor crudo; aquí se traduce el id a nombre.
// "ninguna" es el valor para "Sin asignar" (Select no acepta null como opción).
const SelectorMesera = ({ meseras, value, onChange, excluir, permitirNinguna = false, placeholder = "Elige una mesera" }) => {
    const opciones = meseras.filter(m => m.id_usuarios !== excluir);
    const etiqueta = (v) => {
        if (v === "ninguna") return "Sin asignar";
        return meseras.find(m => String(m.id_usuarios) === v)?.nombre ?? placeholder;
    };

    return (
        <Select value={value ?? ""} onValueChange={onChange}>
            <SelectTrigger className="bg-rf-bg border-rf-border-strong w-full h-10">
                <SelectValue>{(v) => (v ? etiqueta(v) : <span className="text-rf-text-3">{placeholder}</span>)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-rf-surface border-rf-border text-rf-text">
                {opciones.map(m => (
                    <SelectItem key={m.id_usuarios} value={String(m.id_usuarios)}>
                        <span className={`size-2.5 rounded-full ${colorDeMesera(meseras, m.id_usuarios).punto}`} />
                        {m.nombre}
                    </SelectItem>
                ))}
                {permitirNinguna && (
                    <SelectItem value="ninguna">
                        <span className={`size-2.5 rounded-full ${SIN_ASIGNAR.punto}`} />
                        Sin asignar
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

export default SelectorMesera;
