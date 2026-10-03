import { useState } from "react";
import { toast } from "sonner";
import { usuarioService } from "@/services/usuarioService";

const VALIDACIONES = {
    nombre: (v) => !v.trim() ? "El nombre es obligatorio" : null,
    email: (v) => {
        if (!v.trim()) return "El email es obligatorio";
        if (!/\S+@\S+\.\S+/.test(v)) return "Formato de email inválido";
        return null;
    },
    contrasena: (v) =>
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v)
            ? "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
            : null,
    rol: (v) => !v ? "Debes seleccionar un rol" : null
};

const ESTADO_INICIAL = {
    nombre: "",
    email: "",
    contrasena: "",
    rol: ""
};

export const useFormEmpleado = () => {
    const [nuevoUsuario, setNuevoUsuario] = useState(ESTADO_INICIAL);
    const [errores, setErrores] = useState({});

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
    };

    const actualizarRol = (valor) => {
        setNuevoUsuario(prev => ({ ...prev, rol: valor }));
        if (errores.rol) setErrores(prev => ({ ...prev, rol: null }));
    };

    const validar = () => {
        const nuevosErrores = {};
        Object.keys(VALIDACIONES).forEach(campo => {
            const error = VALIDACIONES[campo](nuevoUsuario[campo]);
            if (error) nuevosErrores[campo] = error;
        });
        return nuevosErrores;
    };

    const guardar = async () => {
        const nuevosErrores = validar();
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length === 0) {
            const toastId = toast.loading("Guardando empleado...");

            try {
                const creado = await usuarioService.crearUsuario(nuevoUsuario);
                toast.success("¡Empleado registrado correctamente! 🎉", { id: toastId });
                setNuevoUsuario(ESTADO_INICIAL);
                setErrores({});
                return creado;
            } catch (error) {
                toast.error(error.response?.data?.mensaje || "Hubo un problema al guardar el empleado. ❌", { id: toastId });
                return null;
            }
        } else {
            toast.warning("Por favor, revisa los campos marcados en rojo.");
            return null;
        }
    };

    return { nuevoUsuario, manejarCambio, actualizarRol, guardar, errores };
};