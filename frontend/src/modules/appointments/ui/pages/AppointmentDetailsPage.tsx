import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";

import {
    faArrowLeft,
    faPen,
    faUser,
    faBan
} from "@fortawesome/free-solid-svg-icons";

type AppointmentDetails = {
    id: string;
    patientId: string;
    patient: string;
    doctor: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
    status: string;
};

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

                        <Button
                            icon={faBan}
                            label="Cancelar cita"
                            color="gray"
                            variant="outline"
                        />

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

        </div>
    );
};

export default AppointmentDetailsPage;