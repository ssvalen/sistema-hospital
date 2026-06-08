export const PATIENT_PERMISSIONS = {
    MODULE_ACCESS: 'patient.module',
    CREATE: 'patient.create',
    EDIT: 'patient.edit',
    VIEW_DETAIL: 'patient.view.detail',
    INACTIVATE_PATIENTS: 'patient.inactivate'
} as const

export type PatientPermission =
    typeof PATIENT_PERMISSIONS[keyof typeof PATIENT_PERMISSIONS]