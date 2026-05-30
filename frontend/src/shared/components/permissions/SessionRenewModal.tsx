type Props = {
  open: boolean;
  loading?: boolean;
  onRenew: () => void;
  onLogout: () => void;
  onClose: () => void;
};

export default function SessionRenewModal({
  open,
  loading = false,
  onRenew,
  onLogout,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_-10px_rgba(0,0,0,0.35)] border border-gray-100">
        
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

        <div className="p-6">
          
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              ⚠️
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Sesión por expirar
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tu sesión está a punto de caducar.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4 border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              Si no renuevas ahora, se cerrará tu sesión y tendrás que volver a iniciar sesión.
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            
            <button
              onClick={onLogout}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cerrar sesión
            </button>

            <button
              onClick={onRenew}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Renovando...
                </span>
              ) : (
                "Renovar sesión"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}