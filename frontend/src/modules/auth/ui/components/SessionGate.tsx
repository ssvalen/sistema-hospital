import SessionRenewModal from "@/shared/components/permissions/SessionRenewModal";
import { useSessionManager } from "@/modules/auth/hooks/useSessionManager";

export default function SessionGate() {
  const { showRenewModal, renew, forceLogout, close, renewing } =
    useSessionManager(60_000);

  return (
    <SessionRenewModal
      open={showRenewModal}
      loading={renewing}
      onRenew={renew}
      onLogout={forceLogout}
      onClose={close}
    />
  );
}