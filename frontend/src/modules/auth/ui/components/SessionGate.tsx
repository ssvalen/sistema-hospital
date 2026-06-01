import SessionRenewModal from "@/shared/components/permissions/SessionRenewModal";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import { useSessionManager } from "@/modules/auth/hooks/useSessionManager";

export default function SessionGate() {
  const {
    showRenewModal,
    renew,
    forceLogout,
    close,
    loading,
  } = useSessionManager(60_000);

  const { toast, showToast, hideToast } = useToast();

  const handleRenew = async () => {
    await renew();
    showToast("El nombre es obligatorio", TOAST_TYPES.ERROR);
    showToast("Sesión renovada correctamente", TOAST_TYPES.SUCCESS);
  };

  const handleLogout = async () => {
    showToast("Cerrando sesión...", TOAST_TYPES.LOADING);
    await forceLogout();
  };

  return (
    <>
      <SessionRenewModal
        open={showRenewModal}
        loading={loading}
        onRenew={handleRenew}
        onLogout={handleLogout}
        onClose={close}
      />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
}