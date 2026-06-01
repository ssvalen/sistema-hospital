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
  PATIENT_GET_BY_ID: '/api/hospitaldb/clinico/pacientes'
} as const;