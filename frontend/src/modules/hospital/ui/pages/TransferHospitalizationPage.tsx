import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import {
faArrowLeft,
faRightLeft,
faBed,
faBuildingUser,
faClockRotateLeft
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TransferHospitalizationPage = () => {

const navigate = useNavigate();
const { id } = useParams();

const { toast, showToast, hideToast } = useToast();

const [saving, setSaving] = useState(false);

const [newArea, setNewArea] = useState("");
const [newRoom, setNewRoom] = useState("");
const [newBed, setNewBed] = useState("");
const [reason, setReason] = useState("");

const hospitalization = {
    id,

    patient: "Juan Pérez",
    expediente: "EXP-000123",

    currentArea: "Medicina Interna",
    currentRoom: "Sala A",
    currentBed: "12",

    doctor: "Dr. Carlos López",

    admissionDate: "2026-06-01",

    transfers: [
        {
            date: "2026-06-01 08:30",
            from: "Emergencia",
            to: "Medicina Interna",
            reason: "Ingreso hospitalario"
        }
    ]
};

const validate = () => {

    if (!newArea) {
        showToast(
            "Seleccione una nueva área",
            TOAST_TYPES.ERROR
        );
        return false;
    }

    if (!newRoom) {
        showToast(
            "Seleccione una sala",
            TOAST_TYPES.ERROR
        );
        return false;
    }

    if (!newBed) {
        showToast(
            "Seleccione una cama",
            TOAST_TYPES.ERROR
        );
        return false;
    }

    if (!reason.trim()) {
        showToast(
            "Ingrese motivo del traslado",
            TOAST_TYPES.ERROR
        );
        return false;
    }

    return true;
};

const transferPatient = async () => {

    if (!validate()) return;

    setSaving(true);

    setTimeout(() => {

        showToast(
            "Traslado realizado correctamente",
            TOAST_TYPES.SUCCESS
        );

        setSaving(false);

        navigate("/admin/hospitalizations");

    }, 1000);
};

return (
    <>
        <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>

                    <h1 className="text-2xl font-semibold text-slate-800">
                        Traslado hospitalario
                    </h1>

                    <p className="text-sm text-slate-500">
                        Cambio de ubicación del paciente
                    </p>

                </div>

                <Button
                    icon={faArrowLeft}
                    label="Volver"
                    color="gray"
                    variant="outline"
                    onClick={() => navigate(-1)}
                />

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                <div className="xl:col-span-3 space-y-6">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <div className="flex items-center gap-3 mb-6">

                            <FontAwesomeIcon
                                icon={faBuildingUser}
                                className="text-blue-600"
                            />

                            <h2 className="text-lg font-semibold text-slate-700">
                                Ubicación actual
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Área
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.currentArea}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Sala
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.currentRoom}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Cama
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.currentBed}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Médico
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.doctor}
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-6">
                            Nueva ubicación
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <FormField label="Área destino">

                                <Select
                                    value={newArea}
                                    onChange={(e) =>
                                        setNewArea(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option>
                                        Cirugía
                                    </option>

                                    <option>
                                        Pediatría
                                    </option>

                                    <option>
                                        Cuidados Intensivos
                                    </option>

                                    <option>
                                        Emergencia
                                    </option>

                                </Select>

                            </FormField>

                            <FormField label="Sala">

                                <Select
                                    value={newRoom}
                                    onChange={(e) =>
                                        setNewRoom(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option>Sala A</option>
                                    <option>Sala B</option>
                                    <option>Sala C</option>

                                </Select>

                            </FormField>

                            <FormField label="Cama">

                                <Select
                                    value={newBed}
                                    onChange={(e) =>
                                        setNewBed(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>

                                </Select>

                            </FormField>

                            <FormField label="Motivo traslado">

                                <Input
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(e.target.value)
                                    }
                                />

                            </FormField>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <div className="flex items-center gap-3 mb-6">

                            <FontAwesomeIcon
                                icon={faClockRotateLeft}
                                className="text-slate-600"
                            />

                            <h2 className="text-lg font-semibold text-slate-700">
                                Historial de movimientos
                            </h2>

                        </div>

                        <div className="space-y-4">

                            {hospitalization.transfers.map(
                                (transfer, index) => (
                                    <div
                                        key={index}
                                        className="border border-slate-200 rounded-xl p-4"
                                    >
                                        <div className="flex justify-between items-start gap-4">

                                            <div>

                                                <p className="font-medium text-slate-700">
                                                    {transfer.from}
                                                    {" → "}
                                                    {transfer.to}
                                                </p>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {transfer.reason}
                                                </p>

                                            </div>

                                            <span className="text-xs text-slate-400">
                                                {transfer.date}
                                            </span>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </div>

                <div className="space-y-5">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                        <h2 className="font-semibold text-slate-700 mb-4">
                            Paciente
                        </h2>

                        <div className="space-y-3">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Nombre
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.patient}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Expediente
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.expediente}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Ingreso
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.admissionDate}
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                        <div className="flex items-center gap-3 mb-3">

                            <FontAwesomeIcon
                                icon={faBed}
                                className="text-blue-700"
                            />

                            <div>

                                <h3 className="font-semibold text-blue-700">
                                    Cambio de ubicación
                                </h3>

                                <p className="text-xs text-blue-600">
                                    La cama actual quedará disponible
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex justify-end gap-3">

                <Button
                    label="Cancelar"
                    color="gray"
                    variant="outline"
                    onClick={() => navigate(-1)}
                />

                <Button
                    icon={faRightLeft}
                    color="blue"
                    label={
                        saving
                            ? "Procesando..."
                            : "Confirmar traslado"
                    }
                    onClick={transferPatient}
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

export default TransferHospitalizationPage;
