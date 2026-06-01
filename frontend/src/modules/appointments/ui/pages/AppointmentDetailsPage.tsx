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

import type { AppointmentDetails } from "../../types/AppointmentDetails";
import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";

const mockAppointments: Record<
    string,
    AppointmentDetails
> = {
    "1": {
        id: "1",
        patientId: "p1",
        patient: "Juan Pérez",
        doctor: "Dr. López",
        date: "2026-05-10",
        startTime: "09:00",
        endTime: "09:30",
        reason: "Control general",
        status: "Programada"
    }
};

const statusStyles: Record<
    string,
    string
> = {
    Programada:
        "bg-blue-100 text-blue-700",

    Cancelada:
        "bg-red-100 text-red-700",

    Completada:
        "bg-emerald-100 text-emerald-700"
};

const AppointmentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    //Modal
    const [open, setOpen] = useState(false);
    const openCancelConfirmation = () => setOpen(true)
    const close = () => {
        setOpen(false);
    };
    //Data

    const data = id
        ? mockAppointments[id]
        : undefined;

    if (!data) {
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

    return (
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
                                {data.patient}
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                            <div>

                                <p className="text-xs text-slate-400 mb-1">
                                    Fecha
                                </p>

                                <p className="font-medium text-slate-700">
                                    {data.date}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-slate-400 mb-1">
                                    Horario
                                </p>

                                <p className="font-medium text-slate-700">
                                    {data.startTime} -{" "}
                                    {data.endTime}
                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-slate-400 mb-2">
                                    Estado
                                </p>

                                <span
                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusStyles[data.status]}`}
                                >
                                    {data.status}
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="flex flex-col sm:flex-row xl:flex-col gap-3 xl:min-w-[220px]">
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
                        <CanAccess permission={PERMISSIONS.APPOINTMENT.VIEW_PATIENT_RECORD}>
                            <Button
                                icon={faUser}
                                label="Ver expediente"
                                color="gray"
                                onClick={() =>
                                    navigate(
                                        `/admin/patients/${data.patientId}`
                                    )
                                }
                            />
                        </CanAccess>
                        <CanAccess permission={PERMISSIONS.APPOINTMENT.CANCEL}>
                            <Button
                                icon={faBan}
                                label="Cancelar cita"
                                color="gray"
                                onClick={openCancelConfirmation}
                                variant="outline"
                            />
                        </CanAccess>

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
                            {data.doctor}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-slate-400 mb-1">
                            Motivo
                        </p>

                        <p className="font-medium text-slate-700">
                            {data.reason}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-slate-400 mb-1">
                            Fecha de cita
                        </p>

                        <p className="font-medium text-slate-700">
                            {data.date}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs text-slate-400 mb-1">
                            Horario
                        </p>

                        <p className="font-medium text-slate-700">
                            {data.startTime} -{" "}
                            {data.endTime}
                        </p>

                    </div>

                    <div className="md:col-span-2">

                        <p className="text-xs text-slate-400 mb-2">
                            Observaciones
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">

                            <p className="text-sm text-slate-700 leading-relaxed">
                                {data.reason}
                            </p>

                        </div>

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
                            onClick={() => close()}
                        />

                    </div>

                </div>
            </Modal>
        </div>


    );
};

export default AppointmentDetailsPage;