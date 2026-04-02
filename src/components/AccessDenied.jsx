export const AccessDenied = ({ roleRequired }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="bg-red-50 p-8 rounded-2xl shadow-sm border border-red-100 max-w-md">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
                <p className="text-gray-600 mb-6">
                    No tienes los permisos de <strong>{roleRequired}</strong> necesarios para este servicio.
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Volver atrás
                </button>
            </div>
        </div>
    );
};