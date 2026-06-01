export const APPOINTMENT_PERMISSIONS = {
    MODULE_ACCESS: 'appointment.module',
    VIEW_ALL_APPOINTMENTS: 'appointment.view.all',
    CREATE: 'appointment.create',
    EDIT: 'appointment.edit',
    FILTER: 'appointment.filter',
    VIEW_DETAIL: 'appointment.view.detail',
    VIEW_PATIENT_RECORD: 'appointment.view.patient.record',
    ATTEND: 'appointment.view.attend',
    CANCEL: 'appointment.cancel',

} as const

export type AppointmentPermission =
    typeof APPOINTMENT_PERMISSIONS[keyof typeof APPOINTMENT_PERMISSIONS]