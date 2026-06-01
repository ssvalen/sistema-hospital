import { ADMIN_PERMISSIONS } from "@/modules/admin/ui/utils/adminPermissions";
import { APPOINTMENT_PERMISSIONS } from "@/modules/appointments/ui/utils/appointmentsPermissions";
import { PATIENT_PERMISSIONS } from "@/modules/patients/ui/utils/patientsPermissions";

export const PERMISSIONS = {
    APPOINTMENT: APPOINTMENT_PERMISSIONS,
    PATIENT: PATIENT_PERMISSIONS,
    ADMIN: ADMIN_PERMISSIONS
} as const 