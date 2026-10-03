// Orden natural por número: "2" antes que "10", y "T1" junto a las demás letras.
export const porNumero = (a, b) => a.numero.localeCompare(b.numero, 'es', { numeric: true });
