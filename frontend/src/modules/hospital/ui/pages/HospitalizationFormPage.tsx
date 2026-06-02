import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";
import DataList from "@/shared/components/forms/DataList";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import {
    faArrowLeft,
    faSave
} from "@fortawesome/free-solid-svg-icons";

type Option = {
    id: string;
    label: string;
    subtitle?: string;
};

const HospitalizationFormPage = () => {

    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    const [saving, setSaving] = useState(false);

    // DATA LIST OPTIONS
    const patients: Option[] = [
        {
            id: "1",
            label: "Juan Pérez",
            subtitle: "EXP-000123 · 45 años"
        },
        {
            id: "2",
            label: "Ana García",
            subtitle: "EXP-000124 · 28 años"
        },
        {
            id: "3",
            label: "Carlos López",
            subtitle: "EXP-000125 · 67 años"
        }
    ];

    const doctors: Option[] = [
        {
            id: "1",
            label: "Dr. Carlos López",
            subtitle: "Medicina Interna"
        },
        {
            id: "2",
            label: "Dra. María Pérez",
            subtitle: "Cirugía"
        }
    ];

    // STATE (compatible con DataList)
    const [patient, setPatient] = useState<Option | null>(null);
    const [doctor, setDoctor] = useState<Option | null>(null);

    const [area, setArea] = useState("");
    const [admissionDate, setAdmissionDate] = useState("2026-06-02");

    const [diagnosis, setDiagnosis] = useState("");
    const [reason, setReason] = useState("");
    const [observations, setObservations] = useState("");

    const validate = () => {

        if (!patient) {
            showToast("Seleccione un paciente", TOAST_TYPES.ERROR);
            return false;
        }

        if (!area) {
            showToast("Seleccione un área", TOAST_TYPES.ERROR);
            return false;
        }

        if (!doctor) {
            showToast("Seleccione un médico", TOAST_TYPES.ERROR);
            return false;
        }

        if (!diagnosis.trim()) {
            showToast("Ingrese diagnóstico", TOAST_TYPES.ERROR);
            return false;
        }

        return true;
    };

    const save = () => {

        if (!validate()) return;

        setSaving(true);

        setTimeout(() => {

            showToast(
                "Hospitalización registrada",
                TOAST_TYPES.SUCCESS
            );

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
                            Nueva hospitalización
                        </h1>
                        <p className="text-sm text-slate-500">
                            Registro de ingreso hospitalario
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

                <div className="space-y-6">

                    {/* PACIENTE */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Paciente
                        </h2>

                        <FormField label="Buscar paciente">
                            <DataList
                                options={patients}
                                value={patient}
                                onChange={setPatient}
                                placeholder="Buscar paciente"
                            />
                        </FormField>

                        {patient && (
                            <div className="mt-6 bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-400">
                                    Seleccionado
                                </p>
                                <p className="font-medium text-slate-700">
                                    {patient.label}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {patient.subtitle}
                                </p>
                            </div>
                        )}

                        <div className="mt-5">
                            <FormField label="Fecha ingreso">
                                <Input
                                    type="date"
                                    value={admissionDate}
                                    onChange={(e) =>
                                        setAdmissionDate(e.target.value)
                                    }
                                />
                            </FormField>
                        </div>

                    </div>

                    {/* UBICACIÓN */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Ubicación hospitalaria
                        </h2>

                        <FormField label="Área">
                            <Select
                                value={area}
                                onChange={(e) =>
                                    setArea(e.target.value)
                                }
                            >
                                <option value="">Seleccionar</option>
                                <option>Medicina Interna</option>
                                <option>Cirugía</option>
                                <option>Pediatría</option>
                                <option>Emergencia</option>
                            </Select>
                        </FormField>

                    </div>

                    {/* CLÍNICA */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Información clínica
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <FormField label="Médico responsable">
                                <DataList
                                    options={doctors}
                                    value={doctor}
                                    onChange={setDoctor}
                                    placeholder="Buscar médico"
                                />
                            </FormField>

                            <FormField label="Diagnóstico ingreso">
                                <Input
                                    value={diagnosis}
                                    onChange={(e) =>
                                        setDiagnosis(e.target.value)
                                    }
                                />
                            </FormField>

                            <div className="md:col-span-2">
                                <FormField label="Motivo hospitalización">
                                    <Input
                                        value={reason}
                                        onChange={(e) =>
                                            setReason(e.target.value)
                                        }
                                    />
                                </FormField>
                            </div>

                            <div className="md:col-span-2">
                                <FormField label="Observaciones">
                                    <Input
                                        value={observations}
                                        onChange={(e) =>
                                            setObservations(e.target.value)
                                        }
                                    />
                                </FormField>
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
                        onClick={() =>
                            navigate("/admin/hospitalizations")
                        }
                    />

                    <Button
                        icon={faSave}
                        color="blue"
                        label={
                            saving
                                ? "Guardando..."
                                : "Registrar hospitalización"
                        }
                        onClick={save}
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

export default HospitalizationFormPage;