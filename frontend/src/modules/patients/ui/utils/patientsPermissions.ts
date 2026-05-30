export const PATIENT_PERMISSIONS = {
    MODULE_ACCESS: 'patient.module',
    CREATE: 'patient.create',
    EDIT: 'patient.edit',
    FILTER: 'patient.filter',
    VIEW_DETAIL: 'patient.view.detail',
    INACTIVATE: 'patient.inactivate'
} as const

export type PatientPermission =
    typeof PATIENT_PERMISSIONS[keyof typeof PATIENT_PERMISSIONS]