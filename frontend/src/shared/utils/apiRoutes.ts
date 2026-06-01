export const API_ROUTES = {
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
};