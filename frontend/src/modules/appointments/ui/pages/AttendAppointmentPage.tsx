import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import {
    faArrowLeft,
    faFloppyDisk,
    faCheck,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";

type MedicationCatalog = {
    idMedicamento: number;
    nombreComercial: string;
    principioActivo: string;
    unidadMedida: string;
    cantidadTratamientos: number;
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

    const { toast, showToast, hideToast } = useToast();

    const medicamentosDisponibles: MedicationCatalog[] = [
        {
            idMedicamento: 1,
            nombreComercial: "Paracetamol",
            principioActivo: "Acetaminofén",
            unidadMedida: "Tabletas",
            cantidadTratamientos: 150,
            stockTotal: 500
        },
        {
            idMedicamento: 2,
            nombreComercial: "Ibuprofeno",
            principioActivo: "Ibuprofeno",
            unidadMedida: "Tabletas",
            cantidadTratamientos: 90,
            stockTotal: 250
        },
        {
            idMedicamento: 3,
            nombreComercial: "Amoxicilina",
            principioActivo: "Amoxicilina",
            unidadMedida: "Cápsulas",
            cantidadTratamientos: 40,
            stockTotal: 120
        }
    ];

    const [diagnostico, setDiagnostico] = useState("");
    const [fechaInicio, setFechaInicio] = useState("2026-06-02");
    const [fechaFin, setFechaFin] = useState("2026-06-09");
    const [tratamiento, setTratamiento] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const [medicamentoId, setMedicamentoId] = useState("");
    const [dosis, setDosis] = useState("");
    const [cantidad, setCantidad] = useState<number>(0);

    const [medicamentos, setMedicamentos] = useState<Medication[]>([]);

    const appointment = {
        idCita: 145,
        fechaHora: "02/06/2026 08:30",
        estado: "EN ATENCIÓN",

        pacienteNombre: "Juan",
        pacienteApellido: "Pérez",
        pacienteTelefono: "5555-1111",

        medicoNombre: "Carlos",
        medicoApellido: "López",
        especialidad: "Medicina General",

        edad: 35,
        genero: "Masculino",
        alergias: "Penicilina",
        enfermedades: "Diabetes Tipo 2"
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

    const guardarBorrador = () => {
        showToast(
            "Consulta guardada temporalmente",
            TOAST_TYPES.SUCCESS
        );
    };

    const finalizarConsulta = () => {
        if (!diagnostico.trim()) {
            showToast(
                "Ingrese un diagnóstico",
                TOAST_TYPES.ERROR
            );
            return;
        }

        showToast(
            "Consulta finalizada correctamente",
            TOAST_TYPES.SUCCESS
        );
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
                                    Información del paciente
                                </h2>

                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                    {appointment.estado}
                                </span>

                            </div>

                            <div className="space-y-4">

                                <div>
                                    <p className="text-xs text-slate-400">Paciente</p>
                                    <p className="font-medium text-slate-700">
                                        {appointment.pacienteNombre} {appointment.pacienteApellido}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Teléfono</p>
                                    <p className="font-medium text-slate-700">
                                        {appointment.pacienteTelefono}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Edad</p>
                                    <p className="font-medium text-slate-700">
                                        {appointment.edad} años
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Género</p>
                                    <p className="font-medium text-slate-700">
                                        {appointment.genero}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Alergias</p>
                                    <p className="font-medium text-red-600">
                                        {appointment.alergias}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Antecedentes</p>
                                    <p className="font-medium text-slate-700">
                                        {appointment.enfermedades}
                                    </p>
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
                                            setFechaInicio(e.target.value)
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
                                        onChange={(e) =>
                                            setMedicamentoId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Seleccione medicamento
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

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Tratamientos
                                        </p>

                                        <p className="font-medium text-slate-700">
                                            {medicamentoSeleccionado.cantidadTratamientos}
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
                        icon={faFloppyDisk}
                        label="Guardar borrador"
                        color="gray"
                        onClick={guardarBorrador}
                    />

                    <Button
                        icon={faCheck}
                        label="Finalizar consulta"
                        color="green"
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