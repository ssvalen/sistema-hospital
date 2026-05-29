export const APPOINTMENT_PERMISSIONS = {
    MODULE_ACCESS: 'appointment.module',
    CREATE: 'appointment.create',
    EDIT: 'appointment.edit',
    FILTER: 'appointment.filter',
    VIEW_DETAIL: 'appointment.view.detail',
    VIEW_PATIENT_RECORD: 'appointment.view.patient.record',
    ATTEND: 'appointment.view.attend'

} as const

export type AppointmentPermission =
    typeof APPOINTMENT_PERMISSIONS[keyof typeof APPOINTMENT_PERMISSIONS]