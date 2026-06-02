export const HOSPITAL_PERMISSIONS = {

    MODULE_ACCESS: 'hospital.module',
    CREATE_ADMISION: 'hospital.create.admission',
    TRANSFER_PATIENT: 'hospital.transfer',
    EGRESS_PATIENT: 'hospital.egress',
    VIEW_TRANSFER_HISTORICAL: 'hospital.transfer.historical',
    VIEW_ADMISSION_DETAIL: 'hospital.view.admission.detail',
    VIEW_ALL_ADMISSIONS: 'hospital.admission.view.all'

} as const

export type HospitalPermission =
    typeof HOSPITAL_PERMISSIONS[keyof typeof HOSPITAL_PERMISSIONS]