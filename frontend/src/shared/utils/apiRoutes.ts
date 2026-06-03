import { APPOINTMENT_PERMISSIONS } from "@/modules/appointments/ui/utils/appointmentsPermissions";

export const API_ROUTES = {
  // AUTH
  KEYCLOAK_LOGIN: '/realms/hotel-db/protocol/openid-connect/token',
  KEYCLOAK_LOGOUT: '/realms/hotel-db/protocol/openid-connect/logout',
  KEYCLOAK_REFRESH: '/realms/hotel-db/protocol/openid-connect/token',
  // ROLES
  ROLE_GET_ALL: '/api/hospitaldb/administrativo/roles',
  ROLE_CREATE: '/api/hospitaldb/administrativo/roles',
  ROLE_GET_PAGINATED: '/api/hospitaldb/administrativo/roles/paginado',
  // PERMISSIONS
  PERMISSION_GET_ALL: '/api/hospitaldb/administrativo/permisos',
  PERMISSION_GET_BY_ROLE: (roleId: number) => `/api/hospitaldb/administrativo/roles/${roleId}/permisos`,
  PERMISSION_GET_PAGINATED: '/api/hospitaldb/administrativo/permisos/paginado',
  PERMISSION_CREATE: '/api/hospitaldb/administrativo/permisos',
  PERMISSION_UPDATE: '/api/hospitaldb/administrativo/permisos',
  //  PATIENTS
  PATIENT_GET_ALL: '/api/hospitaldb/clinico/pacientes',
  PATIENT_GET_PAGINATED: '/api/hospitaldb/clinico/pacientes/paginado',
  PATIENT_CREATE: '/api/hospitaldb/clinico/pacientes',
  PATIENT_PUT: '/api/hospitaldb/clinico/pacientes',
  PATIENT_GET_BY_ID: '/api/hospitaldb/clinico/pacientes',
  // APPOINTMENTS
  APPOINTMENT_GET_ALL: '/api/hospitaldb/clinico/citas',
  APPOINTMENT_GET_PAGINATED: '/api/hospitaldb/clinico/citas/paginado',
  APPOINTMENT_GET_BY_ID: '/api/hospitaldb/clinico/citas',
  APPOINTMENT_GET_BY_PATIENT: '/api/hospitaldb/clinico/citas/paciente',
  APPOINTMENT_GET_BY_MEDIC:  '/api/hospitaldb/clinico/citas/medico' ,
  APPOINTMENT_CREATE: '/api/hospitaldb/clinico/citas',
  APPOINTMENT_UPDATE: '/api/hospitaldb/clinico/citas',
  // TREATMENTS
  TREATMENT_GET_ALL: '/api/hospitaldb/clinico/tratamientos',
  TREATMENT_GET_PAGINATED: '/api/hospitaldb/clinico/tratamientos/paginado',
  TREATMENT_GET_BY_PATIENT: '/api/hospitaldb/clinico/tratamientos/paciente',
  TREATMENT_GET_BY_APPOINTMENT: '/api/hospitaldb/clinico/tratamientos/cita',
  TREATMENT_CREATE: '/api/hospitaldb/clinico/tratamientos',
  TREATMENT_UPDATE: '/api/hospitaldb/clinico/tratamientos',
  // MEDICATIONS
  MEDICATION_GET_ALL: '/api/hospitaldb/medicamentos',
  MEDICATION_GET_BY_TREATMENT: '/api/hospitaldb/medicamentos/tratamiento-medicamentos/tratamiento',
  MEDICATION_CREATE: '/api/hospitaldb/medicamentos/tratamiento-medicamentos',
  MEDICATION_UPDATE: '/api/hospitaldb/medicamentos/tratamiento-medicamentos',
} as const;