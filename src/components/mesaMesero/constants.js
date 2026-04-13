import { UtensilsCrossed, Star, Fish, GlassWater, Cookie } from 'lucide-react';

export const CATEGORIA_ICON = {
    'Comida':         UtensilsCrossed,
    'Especialidades': Star,
    'Mariscos':       Fish,
    'Bebidas':        GlassWater,
    'Antojitos':      Cookie,
};

export const TEMAS_MESA = {
    comida: {
        bg: "bg-cyan-500",
        bgHover: "hover:bg-cyan-600",
        bgTenue: "bg-cyan-500/10",
        bgTenueHover: "hover:bg-cyan-500",
        text: "text-cyan-500",
        textHover: "hover:text-cyan-500",
        border: "hover:border-cyan-500/50",
        shadow: "shadow-cyan-900/30",
    },
    desayuno: {
        bg: "bg-amber-500",
        bgHover: "hover:bg-amber-600",
        bgTenue: "bg-amber-500/10",
        bgTenueHover: "hover:bg-amber-500",
        text: "text-amber-500",
        textHover: "hover:text-amber-500",
        border: "hover:border-amber-500/50",
        shadow: "shadow-amber-900/30",
    },
};
