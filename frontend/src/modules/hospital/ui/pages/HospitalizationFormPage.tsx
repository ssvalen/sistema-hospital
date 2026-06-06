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

import { useGetAllPatients } from "@/modules/patients/hooks/useGetAllPatients";

import {
    faArrowLeft,
    faSave
} from "@fortawesome/free-solid-svg-icons";

import { useHospitalAreas } from "../../hooks/hospitalArea/useHospitalAreas";
import { useCreateIngress } from "../../hooks/hospitalitation/useCreateIngress";
import type { HospitalitationRequestParams } from "../../types/HospitalitationTypes";

type Option = {
    id: string;
    label: string;
    subtitle?: string;
};

const HospitalizationFormPage = () => {

    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    const [saving, setSaving] = useState(false);

    const { data: patients } = useGetAllPatients(true);
    const { data: hospitalAreasData } = useHospitalAreas();

    const createIngress = useCreateIngress()

    const patientOptions: Option[] =
        patients?.map((patient) => ({
            id: String(patient.id),
            label: `${patient.nombre} ${patient.apellido}`,
            subtitle: String(patient.telefono),
        })) ?? [];

    const [patient, setPatient] = useState<Option | null>(null);
    const [areaId, setAreaId] = useState("");
    const [reason, setReason] = useState("");
    const [observations, setObservations] = useState("");

    const validate = () => {

        if (!patient) {
            showToast(
                "Debe seleccionar un paciente",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        const selectedAreaId = Number(areaId);

        if (
            !areaId ||
            Number.isNaN(selectedAreaId) ||
            !hospitalAreasData?.some(
                (area) => area.id === selectedAreaId
            )
        ) {
            showToast(
                "Debe seleccionar un área válida",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (!reason.trim()) {
            showToast(
                "Debe ingresar el motivo de hospitalización",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        return true;
    };

    const save = async () => {

        if (!validate()) return;

        setSaving(true);

        try {

            const payload: HospitalitationRequestParams = {
                patientId: Number(patient!.id),
                areaId: Number(areaId),
                motive: reason.trim(),
                observations: observations.trim()
            };

            await createIngress.mutateAsync(payload)

            showToast(
                "Hospitalización registrada correctamente",
                TOAST_TYPES.SUCCESS
            );

            setTimeout(() => {
                navigate(-1);
            }, 1500);

        } catch (error) {

            showToast(
                "Ocurrió un error al registrar la hospitalización",
                TOAST_TYPES.ERROR
            );

        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

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

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Paciente
                        </h2>

                        <FormField label="Buscar paciente">
                            <DataList
                                options={patientOptions}
                                value={patient}
                                onChange={setPatient}
                                placeholder="Buscar paciente"
                            />
                        </FormField>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Ubicación hospitalaria
                        </h2>

                        <FormField label="Área">
                            <Select
                                value={areaId}
                                onChange={(e) =>
                                    setAreaId(e.target.value)
                                }
                            >
                                <option value="">
                                    Seleccionar
                                </option>

                                {hospitalAreasData?.map((hospitalArea) => (
                                    <option
                                        key={hospitalArea.id}
                                        value={hospitalArea.id}
                                    >
                                        {hospitalArea.name}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Información clínica
                        </h2>

                        <div className="grid grid-cols-1 gap-5">

                            <FormField label="Motivo de hospitalización">
                                <Input
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(e.target.value)
                                    }
                                />
                            </FormField>

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

                <div className="sticky bottom-0 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex justify-end gap-3">

                    <Button
                        label="Cancelar"
                        color="gray"
                        variant="outline"
                        onClick={() => navigate(-1)}
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
                        disabled={saving}
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

export default HospitalizationFormPage;