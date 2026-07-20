// Mantiene en <html> la clase .app-portrait / .app-landscape según la
// orientación FÍSICA de la pantalla (screen.orientation). Las variantes
// portrait:/landscape: de Tailwind (redefinidas en index.css) leen esta clase
// en vez de la media query, porque el teclado en pantalla encoge el viewport
// y hace que la media query crea que la tablet giró a horizontal.
export const initOrientacion = () => {
    const aplicar = () => {
        const esPortrait = screen.orientation?.type
            ? screen.orientation.type.startsWith('portrait')
            : window.innerHeight >= window.innerWidth;
        document.documentElement.classList.toggle('app-portrait', esPortrait);
        document.documentElement.classList.toggle('app-landscape', !esPortrait);
    };
    aplicar();
    screen.orientation?.addEventListener('change', aplicar);
};
