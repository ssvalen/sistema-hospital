import { useMemo, useState } from "react";
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
    faArrowRightFromBracket,
    faCircleCheck,
    faHospitalUser
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DischargeHospitalizationPage = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const { toast, showToast, hideToast } = useToast();

    const [saving, setSaving] = useState(false);

    const hospitalization = {
        id,
        patient: "Juan Pérez",
        expediente: "EXP-000123",
        area: "Medicina Interna",
        doctor: "Dr. Carlos López",
        admissionDate: "2026-05-25"
    };

    const [dischargeDate, setDischargeDate] = useState("2026-06-02");
    const [condition, setCondition] = useState("");
    const [finalDiagnosis, setFinalDiagnosis] = useState("");
    const [destination, setDestination] = useState("");
    const [instructions, setInstructions] = useState("");
    const [observations, setObservations] = useState("");

    const hospitalizationDays = useMemo(() => {
        const start = new Date(hospitalization.admissionDate);
        const end = new Date(dischargeDate);

        return Math.max(
            1,
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        );
    }, [hospitalization.admissionDate, dischargeDate]);

    const validate = () => {
        if (!dischargeDate) {
            showToast("Seleccione fecha de egreso", TOAST_TYPES.ERROR);
            return false;
        }

        if (!condition) {
            showToast("Seleccione condición de salida", TOAST_TYPES.ERROR);
            return false;
        }

        if (!finalDiagnosis.trim()) {
            showToast("Ingrese diagnóstico final", TOAST_TYPES.ERROR);
            return false;
        }

        if (!instructions.trim()) {
            showToast("Ingrese indicaciones médicas", TOAST_TYPES.ERROR);
            return false;
        }

        return true;
    };

    const dischargePatient = () => {
        if (!validate()) return;

        setSaving(true);

        setTimeout(() => {
            showToast("Egreso registrado correctamente", TOAST_TYPES.SUCCESS);
            setSaving(false);
            navigate("/admin/hospitalizations");
        }, 900);
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Egreso hospitalario
                        </h1>
                        <p className="text-sm text-slate-500">
                            Finalización de estancia hospitalaria
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

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Fecha ingreso</p>
                        <p className="font-semibold text-slate-700 mt-1">
                            {hospitalization.admissionDate}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Días estancia</p>
                        <p className="font-bold text-blue-700 text-2xl mt-1">
                            {hospitalizationDays}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Área</p>
                        <p className="font-semibold text-slate-700 mt-1">
                            {hospitalization.area}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Médico</p>
                        <p className="font-semibold text-slate-700 mt-1">
                            {hospitalization.doctor}
                        </p>
                    </div>

                </div>

                {/* BODY */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                    {/* LEFT */}
                    <div className="xl:col-span-3 space-y-6">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                            <h2 className="text-lg font-semibold text-slate-700 mb-6">
                                Información de egreso
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <FormField label="Fecha egreso">
                                    <Input
                                        type="date"
                                        value={dischargeDate}
                                        min={hospitalization.admissionDate}
                                        onChange={(e) => setDischargeDate(e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Condición de salida">
                                    <Select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option>Recuperado</option>
                                        <option>Mejorado</option>
                                        <option>Referido</option>
                                        <option>Fallecido</option>
                                    </Select>
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField label="Diagnóstico final">
                                        <Input
                                            value={finalDiagnosis}
                                            onChange={(e) => setFinalDiagnosis(e.target.value)}
                                        />
                                    </FormField>
                                </div>

                                <FormField label="Destino">
                                    <Input
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Casa, otro hospital..."
                                    />
                                </FormField>

                                <FormField label="Observaciones">
                                    <Input
                                        value={observations}
                                        onChange={(e) => setObservations(e.target.value)}
                                    />
                                </FormField>

                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                            <h2 className="text-lg font-semibold text-slate-700 mb-5">
                                Indicaciones médicas
                            </h2>

                            <FormField label="Indicaciones de egreso">
                                <Input
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Medicamentos, reposo, controles..."
                                />
                            </FormField>

                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                            <div className="flex items-start gap-4">

                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="text-emerald-700"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-emerald-700">
                                        Confirmación de egreso
                                    </h3>
                                    <p className="text-sm text-emerald-600 mt-2">
                                        Al registrar este egreso la hospitalización quedará finalizada.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                            <div className="flex items-center gap-3 mb-5">
                                <FontAwesomeIcon icon={faHospitalUser} className="text-blue-600" />
                                <h2 className="font-semibold text-slate-700">Paciente</h2>
                            </div>

                            <div className="space-y-4">

                                <div>
                                    <p className="text-xs text-slate-400">Nombre</p>
                                    <p className="font-medium text-slate-700">
                                        {hospitalization.patient}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Expediente</p>
                                    <p className="font-medium text-slate-700">
                                        {hospitalization.expediente}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Médico</p>
                                    <p className="font-medium text-slate-700">
                                        {hospitalization.doctor}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* SOLO INFO, SIN SALA NI CAMA */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                            <h2 className="font-semibold text-slate-700 mb-4">
                                Resumen clínico
                            </h2>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Área</span>
                                    <span className="text-slate-700 font-medium">
                                        {hospitalization.area}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Estancia</span>
                                    <span className="text-slate-700 font-medium">
                                        {hospitalizationDays} días
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}
                <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex justify-end gap-3">

                    <Button
                        label="Cancelar"
                        color="gray"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    />

                    <Button
                        icon={faArrowRightFromBracket}
                        color="green"
                        label={saving ? "Procesando..." : "Registrar egreso"}
                        onClick={dischargePatient}
                    />

                </div>

            </div>

            {/* TOAST */}
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

export default DischargeHospitalizationPage;