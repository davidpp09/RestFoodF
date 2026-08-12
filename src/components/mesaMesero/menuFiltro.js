import { normalizarTexto } from '@/lib/utils';

/**
 * Pestaña que muestra la carta completa en vez de una sola categoría.
 *
 * Es un nombre y no una categoría real: no existe en la base, solo en la UI.
 * Se compara por igualdad contra `categoriaActiva`, así que si algún día
 * naciera una categoría llamada "Todos" habría que renombrar esta constante.
 */
export const CATEGORIA_TODOS = 'Todos';

/**
 * Los platillos que se le ofrecen al mesero dentro de una orden.
 *
 * Tres pasos, en este orden:
 *  1. solo lo que está disponible y tiene precio en el turno abierto;
 *  2. si hay búsqueda manda la búsqueda y se ignora la categoría —el mesero
 *     que teclea "pozole" lo quiere encontrado, no acotado a la pestaña donde
 *     estaba parado—; si no, filtra la categoría activa, salvo que sea
 *     CATEGORIA_TODOS, que no filtra nada;
 *  3. al buscar, los que empiezan por lo tecleado suben.
 *
 * Vive aparte porque la usan dos pantallas: el carrito de mesas y el de
 * entregas. Estaba copiada palabra por palabra en ambas.
 */
export const filtrarMenu = ({ productos, categoriaActiva, busqueda, precioSegunTurno }) => {
    const query = normalizarTexto(busqueda.trim());

    return productos
        .filter(p => p.disponibilidad && precioSegunTurno(p) > 0)
        .filter(p => query
            ? normalizarTexto(p.nombre).includes(query)
            : categoriaActiva === CATEGORIA_TODOS || p.categoria.nombre === categoriaActiva)
        .sort((a, b) => {
            if (!query) return 0;
            const aEmpieza = normalizarTexto(a.nombre).startsWith(query);
            const bEmpieza = normalizarTexto(b.nombre).startsWith(query);
            return aEmpieza === bEmpieza ? 0 : aEmpieza ? -1 : 1;
        });
};

/**
 * Las pestañas que se pintan: "Todos" al frente y después las categorías reales.
 * Devuelve vacío mientras no hayan cargado los productos, para no dejar un
 * "Todos" solitario que no filtra nada.
 */
export const pestanasDeMenu = (categorias) =>
    categorias.length > 0 ? [CATEGORIA_TODOS, ...categorias] : [];
