import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import { useGetAllMedications } from "@/modules/appointments/hooks/medication/useGetAllMedications";


import {
    faArrowLeft,
    faFloppyDisk,
    faCheck,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";

import { APPOINTMENT_STATUS } from "../../types/AppointmentStatus";

import { useAppointmentById } from "../../hooks/appointments/useAppointmentById";
import { useCreateTreatment } from "../../hooks/treatment/useCreateTreatment";
import Skeleton from "@/shared/components/Skeleton";
import type { CreateTreatmentParams } from "../../types/AppointmentTypes";

type MedicationCatalog = {
    idMedicamento: number;
    nombreComercial: string;
    principioActivo: string;
    unidadMedida: string;
    stockTotal: number;
};

type Medication = {
    id: number;
    idMedicamento: number;
    nombreComercial: string;
    principioActivo: string;
    dosis: string;
    cantidad: number;
    unidadMedida: string;
};

const AttendAppointmentPage = () => {

    const navigate = useNavigate();


    const { id } = useParams();
    const appointmentId = Number(id);

    const { toast, showToast, hideToast } = useToast();



    const { data: medicamentosData = [], isLoading: medicamentosLoading } = useGetAllMedications();
    const { data: appointmentData, isLoading: appointmentLoading } = useAppointmentById(Number(id));


    const medicamentosDisponibles: MedicationCatalog[] =
        medicamentosData.map((med) => ({
            idMedicamento: med.id,
            nombreComercial: med.commercialName,
            principioActivo: med.activeIngredient,
            unidadMedida: med.medicalUnit,
            stockTotal: med.stock ?? 0
        }));

    const {
        mutateAsync: createTreatmentMutation,
        isPending
    } = useCreateTreatment();

    const [diagnostico, setDiagnostico] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [fechaInicio, setFechaInicio] = useState(today);
    const [fechaFin, setFechaFin] = useState(today);
    const [tratamiento, setTratamiento] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const [medicamentoId, setMedicamentoId] = useState("");
    const [dosis, setDosis] = useState("");
    const [cantidad, setCantidad] = useState<number>(0);

    const [medicamentos, setMedicamentos] = useState<Medication[]>([]);

    if (!appointmentData) {
        return
    }

    const handleFechaInicioChange = (
        value: string
    ) => {
        setFechaInicio(value);

        if (
            fechaFin &&
            new Date(fechaFin) < new Date(value)
        ) {
            setFechaFin(value);
        }
    };

    const medicamentoSeleccionado =
        medicamentosDisponibles.find(
            (m) => m.idMedicamento === Number(medicamentoId)
        );

    const agregarMedicamento = () => {
        if (!medicamentoSeleccionado) {
            showToast(
                "Seleccione un medicamento",
                TOAST_TYPES.ERROR
            );
            return;
        }

        if (!dosis.trim()) {
            showToast(
                "Ingrese la dosis",
                TOAST_TYPES.ERROR
            );
            return;
        }

        if (cantidad <= 0) {
            showToast(
                "Cantidad inválida",
                TOAST_TYPES.ERROR
            );
            return;
        }

        if (
            cantidad >
            medicamentoSeleccionado.stockTotal
        ) {
            showToast(
                `Stock disponible: ${medicamentoSeleccionado.stockTotal}`,
                TOAST_TYPES.ERROR
            );
            return;
        }

        const existe = medicamentos.some(
            (m) =>
                m.idMedicamento ===
                medicamentoSeleccionado.idMedicamento
        );

        if (existe) {
            showToast(
                "Este medicamento ya fue agregado",
                TOAST_TYPES.ERROR
            );
            return;
        }

        setMedicamentos((prev) => [
            ...prev,
            {
                id: Date.now(),
                idMedicamento:
                    medicamentoSeleccionado.idMedicamento,
                nombreComercial:
                    medicamentoSeleccionado.nombreComercial,
                principioActivo:
                    medicamentoSeleccionado.principioActivo,
                dosis,
                cantidad,
                unidadMedida:
                    medicamentoSeleccionado.unidadMedida
            }
        ]);

        setMedicamentoId("");
        setDosis("");
        setCantidad(0);

        showToast(
            "Medicamento agregado",
            TOAST_TYPES.SUCCESS
        );
    };

    const eliminarMedicamento = (id: number) => {
        setMedicamentos((prev) =>
            prev.filter((m) => m.id !== id)
        );
    };



    const formatDateTime = (date: Date): string => {
        const pad = (n: number) =>
            String(n).padStart(2, "0");

        return `${date.getFullYear()}-${pad(
            date.getMonth() + 1
        )}-${pad(date.getDate())} ${pad(
            date.getHours()
        )}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}`;
    };

    const finalizarConsulta = () => {
        if (!diagnostico.trim()) {
            showToast(
                "Ingrese un diagnóstico",
                TOAST_TYPES.ERROR
            );
            return;
        }

        if (!tratamiento.trim()) {
            showToast(
                "Ingrese un tratamiento",
                TOAST_TYPES.ERROR
            );
            return;
        }

        const payload: CreateTreatmentParams = {
            appointmentId: appointmentData.id,
            appointmentStatus: APPOINTMENT_STATUS.COMPLETED,
            patientId: appointmentData.patient.id,
            medicId: appointmentData.doctor.id,
            description: `
                Diagnóstico:
                ${diagnostico}

                Tratamiento:
                ${tratamiento}

                Observaciones:
                ${observaciones}
             `.trim(),

            from: fechaInicio,
            to: fechaFin,
            endDate:formatDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
            medications: medicamentos.map((m) => ({
                medicationId: m.idMedicamento,
                dosage: m.dosis,
                quantity: m.cantidad
            }))
        };

        createTreatmentMutation(payload, {
            onSuccess: () => {
                showToast(
                    "Consulta finalizada correctamente",
                    TOAST_TYPES.SUCCESS
                );

                setDiagnostico("");
                setTratamiento("");
                setObservaciones("");
                setMedicamentos([]);

                navigate(-1);
            },

            onError: (error) => {
                console.error(error);

                showToast(
                    "Error al registrar el tratamiento",
                    TOAST_TYPES.ERROR
                );
            }
        });
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Atención de consulta
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Registro clínico, diagnóstico y prescripción médica
                        </p>
                    </div>

                    <Button
                        icon={faArrowLeft}
                        label="Volver"
                        color="gray"
                        onClick={() => navigate(-1)}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-1 space-y-5">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                            <div className="flex justify-between items-center mb-4">

                                <h2 className="font-semibold text-slate-700">
                                    Información de cita
                                </h2>
                                {appointmentLoading ? (
                                    <Skeleton width="w-24" height="h-6" />
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        {appointmentData?.status}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Paciente
                                    </p>

                                    {appointmentLoading ? (
                                        <Skeleton width="w-48" height="h-5" />
                                    ) : (
                                        <p className="font-medium text-slate-700">
                                            {appointmentData?.patient.fullName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Médico
                                    </p>

                                    {appointmentLoading ? (
                                        <Skeleton width="w-48" height="h-5" />
                                    ) : (
                                        <p className="font-medium text-slate-700">
                                            Dr. {appointmentData?.doctor.fullName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Especialidad
                                    </p>

                                    {appointmentLoading ? (
                                        <Skeleton width="w-40" height="h-5" />
                                    ) : (
                                        <p className="font-medium text-slate-700">
                                            {appointmentData?.doctor.specialty}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Fecha programada
                                    </p>

                                    {appointmentLoading ? (
                                        <Skeleton width="w-32" height="h-5" />
                                    ) : (
                                        <p className="font-medium text-slate-700">
                                            {appointmentData?.startDate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Hora programada
                                    </p>

                                    {appointmentLoading ? (
                                        <Skeleton width="w-24" height="h-5" />
                                    ) : (
                                        <p className="font-medium text-slate-700">
                                            {appointmentData?.startTime}
                                        </p>
                                    )}
                                </div>

                            </div>

                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                            <h2 className="font-semibold text-slate-700 mb-4">
                                Resumen
                            </h2>

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Medicamentos
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {medicamentos.length}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Fecha inicio
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {fechaInicio}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Fecha fin
                                    </span>

                                    <span className="font-semibold text-slate-700">
                                        {fechaFin}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="xl:col-span-3 space-y-6">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                            <h2 className="text-lg font-semibold text-slate-700 mb-6">
                                Diagnóstico y tratamiento
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <FormField label="Diagnóstico">
                                    <Input
                                        value={diagnostico}
                                        onChange={(e) =>
                                            setDiagnostico(e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Tratamiento">
                                    <Input
                                        value={tratamiento}
                                        onChange={(e) =>
                                            setTratamiento(e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Fecha inicio">
                                    <Input
                                        type="date"
                                        value={fechaInicio}
                                        onChange={(e) =>
                                            handleFechaInicioChange(e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Fecha fin">
                                    <Input
                                        type="date"
                                        value={fechaFin}
                                        min={fechaInicio}
                                        onChange={(e) =>
                                            setFechaFin(e.target.value)
                                        }
                                    />
                                </FormField>

                            </div>

                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-lg font-semibold text-slate-700">
                                    Medicamentos recetados
                                </h2>

                                <span className="text-sm text-slate-500">
                                    {medicamentos.length} agregados
                                </span>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <FormField label="Medicamento">
                                    <Select
                                        value={medicamentoId}
                                        disabled={medicamentosLoading}
                                        onChange={(e) =>
                                            setMedicamentoId(e.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            {medicamentosLoading
                                                ? "Cargando medicamentos..."
                                                : "Seleccione medicamento"}
                                        </option>

                                        {medicamentosDisponibles.map((m) => (
                                            <option
                                                key={m.idMedicamento}
                                                value={m.idMedicamento}
                                            >
                                                {m.nombreComercial}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField label="Dosis">
                                    <Input
                                        value={dosis}
                                        onChange={(e) =>
                                            setDosis(e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Cantidad">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={
                                            medicamentoSeleccionado?.stockTotal
                                        }
                                        value={cantidad || ""}
                                        onChange={(e) =>
                                            setCantidad(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormField>

                            </div>

                            {medicamentoSeleccionado && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Principio activo
                                        </p>

                                        <p className="font-medium text-slate-700">
                                            {medicamentoSeleccionado.principioActivo}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Unidad
                                        </p>

                                        <p className="font-medium text-slate-700">
                                            {medicamentoSeleccionado.unidadMedida}
                                        </p>
                                    </div>

                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <p className="text-xs text-emerald-600">
                                            Stock disponible
                                        </p>

                                        <p className="font-bold text-emerald-700 text-lg">
                                            {medicamentoSeleccionado.stockTotal}
                                        </p>
                                    </div>

                                </div>
                            )}

                            <div className="mt-5">
                                <Button
                                    icon={faPlus}
                                    label="Agregar medicamento"
                                    color="blue"
                                    onClick={agregarMedicamento}
                                />
                            </div>
                            {medicamentos.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                                    {medicamentos.map((medicamento) => (
                                        <div
                                            key={medicamento.id}
                                            className="border border-slate-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start gap-4">

                                                <div className="flex-1">

                                                    <h3 className="font-semibold text-slate-700">
                                                        {medicamento.nombreComercial}
                                                    </h3>

                                                    <p className="text-sm text-slate-500">
                                                        {medicamento.principioActivo}
                                                    </p>

                                                    <div className="mt-3 space-y-1">

                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-medium">
                                                                Dosis:
                                                            </span>{" "}
                                                            {medicamento.dosis}
                                                        </p>

                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-medium">
                                                                Cantidad:
                                                            </span>{" "}
                                                            {medicamento.cantidad}{" "}
                                                            {medicamento.unidadMedida}
                                                        </p>

                                                    </div>

                                                </div>

                                                <Button
                                                    icon={faTrash}
                                                    color="red"
                                                    onClick={() =>
                                                        eliminarMedicamento(
                                                            medicamento.id
                                                        )
                                                    }
                                                />

                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}

                            {medicamentos.length === 0 && (
                                <div className="mt-6 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">

                                    <p className="text-slate-500">
                                        No se han agregado medicamentos
                                    </p>

                                </div>
                            )}

                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                            <h2 className="text-lg font-semibold text-slate-700 mb-6">
                                Observaciones
                            </h2>

                            <FormField label="Observaciones médicas">
                                <Input
                                    value={observaciones}
                                    onChange={(e) =>
                                        setObservaciones(
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                        </div>

                    </div>

                </div>

                <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row justify-end gap-3">



                    <Button
                        icon={faCheck}
                        label={
                            isPending
                                ? "Registrando..."
                                : "Finalizar consulta"
                        }
                        color="green"
                        disabled={isPending}
                        title="Finalizar consulta y recetar tratamiento"
                        onClick={finalizarConsulta}
                    />

                </div>

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

export default AttendAppointmentPage;