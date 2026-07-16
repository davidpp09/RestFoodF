import { UtensilsCrossed, Star, Fish, GlassWater, Cookie } from 'lucide-react';

export const CATEGORIA_ICON = {
    'Comida':         UtensilsCrossed,
    'Especialidades': Star,
    'Mariscos':       Fish,
    'Bebidas':        GlassWater,
    'Antojitos':      Cookie,
};

// Ambos turnos usan los tokens rf-turno-*; el color real lo decide el
// atributo data-turno del dialog (desayuno = ámbar, comida = cyan) definido
// en index.css, y se adapta solo al tema claro/oscuro.
const TEMA_TURNO = {
    bg: "bg-rf-turno",
    bgHover: "hover:bg-rf-turno-strong",
    bgTenue: "bg-rf-turno-soft",
    bgTenueHover: "hover:bg-rf-turno",
    text: "text-rf-turno-ink",
    textHover: "hover:text-rf-turno-ink",
    border: "hover:border-rf-turno",
    shadow: "",
};

export const TEMAS_MESA = {
    comida: TEMA_TURNO,
    desayuno: TEMA_TURNO,
};
