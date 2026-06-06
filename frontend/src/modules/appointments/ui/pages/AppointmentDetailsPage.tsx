import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import Button from "@/shared/components/forms/Button";
import Modal from "@/shared/components/Modal";
import {
    faArrowLeft,
    faPen,
    faUser,
    faBan,
    faTriangleExclamation,
    faStethoscope
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { APPOINTMENT_STATUS_CONFIG } from "../../types/AppointmentStatusConfig";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";

import { canExecuteAppointmentAction } from "../utils/canExecuteAppointmentAction";
import { useAppointmentById } from "../../hooks/appointments/useAppointmentById";
import { useCancelAppointment } from "../../hooks/appointments/useCancelAppointment";
import { HttpError } from "@/shared/errors/HttpError";






const AppointmentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();
    const { data: appointmentData } = useAppointmentById(Number(id));
    const cancelAppointment = useCancelAppointment()



    const [open, setOpen] = useState(false);

    const openCancelConfirmation = () =>
        setOpen(true);

    const close = () =>
        setOpen(false);

    const cancelarCita = async () => {
        try {
            await cancelAppointment.mutateAsync(Number(id))
            showToast("Cita cancelada exitosamente", TOAST_TYPES.SUCCESS)
        } catch (error) {
            if(error instanceof HttpError) {
                showToast(`${error.message}`, TOAST_TYPES.SUCCESS)
                return
            }
            showToast("Ha ocurrido un error durante la cancelación de la cita.", TOAST_TYPES.SUCCESS)
        } finally {
            close()
        }
    }

    if (!appointmentData) {
        return (
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                    <p className="text-slate-500">
                        Cita no encontrada
                    </p>
                </div>
            </div>
        );
    }

    const statusStyles = APPOINTMENT_STATUS_CONFIG[appointmentData.status];

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">


                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div className="space-y-2">

                        <h1 className="text-2xl font-semibold text-slate-800">
                            Detalle de cita
                        </h1>

                        <p className="text-sm text-slate-500">
                            Información de programación médica
                        </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <Button
                            icon={faArrowLeft}
                            label="Volver"
                            color="gray"
                            variant="outline"
                            onClick={() =>
                                navigate(
                                    "/admin/appointments"
                                )
                            }
                        />
                        {canExecuteAppointmentAction(appointmentData.status, "EDIT") && (

                            <CanAccess permission={PERMISSIONS.APPOINTMENT.EDIT}>
                                <Button
                                    icon={faPen}
                                    label="Editar"
                                    color="blue"
                                    onClick={() =>
                                        navigate(
                                            `/admin/appointments/${id}/edit`
                                        )
                                    }
                                />
                            </CanAccess>
                        )}

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                        <div className="space-y-6 flex-1">

                            <div>

                                <p className="text-sm text-slate-400">
                                    Paciente
                                </p>

                                <h2 className="text-2xl font-semibold text-slate-800 mt-1">
                                    {appointmentData?.patient.fullName}
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">



                                <div>

                                    <p className="text-xs text-slate-400 mb-2">
                                        Estado cita
                                    </p>

                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusStyles.className ??
                                            "bg-slate-100 text-slate-700"
                                            }`}
                                    >
                                        {appointmentData.status}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="flex flex-col sm:flex-row xl:flex-col gap-3 xl:min-w-[220px]">
                            {canExecuteAppointmentAction(appointmentData.status, "ATTEND") && (
                                <CanAccess permission={PERMISSIONS.APPOINTMENT.ATTEND}>
                                    <Button
                                        icon={faStethoscope}
                                        label="Atender cita"
                                        color="green"
                                        onClick={() =>
                                            navigate(
                                                `/admin/appointments/${id}/attend`
                                            )
                                        }
                                    />
                                </CanAccess>
                            )}
                            <CanAccess permission={PERMISSIONS.APPOINTMENT.VIEW_PATIENT_RECORD}>
                                <Button
                                    icon={faUser}
                                    label="Ver expediente"
                                    color="gray"
                                    onClick={() =>
                                        navigate(`/admin/patients/${appointmentData.patient.id}`)
                                    }
                                />
                            </CanAccess>
                            {canExecuteAppointmentAction(appointmentData.status, "CANCEL") && (
                                <CanAccess permission={PERMISSIONS.APPOINTMENT.CANCEL}>
                                    <Button
                                        icon={faBan}
                                        label="Cancelar cita"
                                        color="gray"
                                        onClick={openCancelConfirmation}
                                        variant="outline"
                                    />
                                </CanAccess>
                            )}


                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-700">
                            Información clínica
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                            Datos generales relacionados con la consulta médica.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-xs text-slate-400 mb-1">
                                Médico
                            </p>

                            <p className="font-medium text-slate-700">
                                Dr. {appointmentData.doctor.fullName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 mb-1">
                                Especialidad
                            </p>

                            <p className="font-medium text-slate-700">
                                {appointmentData.doctor.specialty}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 mb-1">
                                Fecha de cita
                            </p>

                            <p className="font-medium text-slate-700">
                                {appointmentData.startDate}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 mb-1">
                                Horario
                            </p>

                            <p className="font-medium text-slate-700">
                                {appointmentData.startTime}
                            </p>
                        </div>

                    </div>

                </div>

                <Modal
                    abierto={open}
                    onClose={close}
                    titulo={"Cancelar cita"}
                    size="md"
                >
                    <div className="space-y-5">
                        <div className="flex flex-col items-center text-center space-y-3 py-4">

                            <div className="p-4 rounded-full bg-amber-50">
                                <FontAwesomeIcon
                                    icon={faTriangleExclamation}
                                    className="text-amber-600"
                                    size="lg"
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    ¿Estás seguro de cancelar esta cita?
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Esta acción no se puede deshacer y la cita quedará marcada como cancelada.
                                </p>
                            </div>

                        </div>
                        <div className="flex justify-end gap-3 pt-2">

                            <Button
                                label="Cerrar"
                                color="gray"
                                variant="outline"
                                onClick={close}
                            />

                            <Button
                                label="Sí, cancelar cita"
                                color="red"
                                variant="solid"
                                onClick={cancelarCita}
                            />

                        </div>

                    </div>
                </Modal>
            </div>
            <div className="fixed top-4 right-4 z-[9999]">
                <Toast
                    show={toast.show}
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            </div>
        </>

    );
};

export default AppointmentDetailsPage;