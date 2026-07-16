export const AccessDenied = ({ roleRequired }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center bg-rf-bg">
            <div className="bg-rf-surface p-8 rounded-lg shadow-rf-sm border border-rf-border max-w-md">
                <div className="text-rf-red text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-rf-text mb-2">Acceso Restringido</h1>
                <p className="text-rf-text-2 mb-6">
                    No tienes los permisos de <strong>{roleRequired}</strong> necesarios para este servicio.
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="bg-rf-accent hover:bg-rf-accent-strong text-white px-6 py-2 rounded-md font-semibold transition-colors"
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
};
