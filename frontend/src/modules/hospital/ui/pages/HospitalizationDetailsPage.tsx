import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Modal from "@/shared/components/Modal";
import Toast from "@/shared/components/Toast";
import HospitalizationHistory from "../components/HospitalizationHistory";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { HOSPITALITATION_STATUS_CONFIG } from "../../types/HospitalitationStatusConfig";
import { TOAST_CONFIG } from "@/shared/types/ToastConfig";

import {
    faArrowLeft,
    faArrowRightFromBracket,
    faUser
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useHospitalitationById } from "../../hooks/hospitalitation/useHospitalitationById";
import { canExecuteHospitalitationAction } from "../utils/canExecuteHospitalitationAction.ts";

const HospitalizationDetailsPage = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const { toast, showToast, hideToast } = useToast();
    
    const { data: hospitalitationData } = useHospitalitationById(Number(id));

    const [openDischarge, setOpenDischarge] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        dischargeDate: "",
        motive: "",
        observations: ""
    });

    const stayDays = useMemo(() => {
        if (!hospitalitationData) return 0;

        const start = new Date(hospitalitationData.hospitalitation.startDate);
        const end = new Date();

        return Math.max(
            1,
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        );
    }, [hospitalitationData]);

    if (!hospitalitationData) return null;

    const statusStyles =
        HOSPITALITATION_STATUS_CONFIG[hospitalitationData.hospitalitation.status];

    const validate = () => {
        if (!form.dischargeDate) {
            showToast("Ingrese fecha de egreso", TOAST_TYPES.ERROR);
            return false;
        }

        if (!form.motive.trim()) {
            showToast("Ingrese motivo de egreso", TOAST_TYPES.ERROR);
            return false;
        }

        if (!form.observations.trim()) {
            showToast("Ingrese observaciones", TOAST_TYPES.ERROR);
            return false;
        }

        return true;
    };

    const handleDischarge = () => {
        if (!validate()) return;

        setSaving(true);
        showToast("Egreso registrado correctamente", TOAST_TYPES.SUCCESS);

        setTimeout(() => {
            setSaving(false);
            setOpenDischarge(false);
            navigate(-1);
        }, TOAST_CONFIG.success.duration);
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            {hospitalitationData.patient.fullname}
                        </h1>

                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles.className}`}>
                            {hospitalitationData.hospitalitation.status}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            icon={faArrowLeft}
                            label="Volver"
                            color="gray"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        />
                        {canExecuteHospitalitationAction(hospitalitationData.hospitalitation.status, "DISCHARGE") && (
                            <Button
                                icon={faArrowRightFromBracket}
                                label="Egresar"
                                color="green"
                                onClick={() => setOpenDischarge(true)}
                            />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Área</p>
                        <p className="font-semibold text-slate-700">
                            {hospitalitationData.hospitalArea.name}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Ingreso</p>
                        <p className="font-semibold text-slate-700">
                            {hospitalitationData.hospitalitation.startDate}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Egreso</p>
                        <p className="font-semibold text-slate-700">
                            {hospitalitationData.hospitalitation.endDate || "-"}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Días estancia</p>
                        <p className="text-xl font-bold text-blue-700">
                            {stayDays}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    <div className="xl:col-span-2 space-y-6">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-700 mb-4">
                                Información clínica
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400">Motivo ingreso</p>
                                    <p className="text-slate-700 font-medium">
                                        {hospitalitationData.hospitalitation.motiveIngress}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Motivo egreso</p>
                                    <p className="text-slate-700 font-medium">
                                        {hospitalitationData.hospitalitation.motiveEgress || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-700 mb-4">
                                Observaciones
                            </h2>
                            <p className="text-slate-700">
                                {hospitalitationData.hospitalitation.observations}
                            </p>
                        </div>


                        <HospitalizationHistory idHospitalization={hospitalitationData.id} />
                    </div>

                    <div className="space-y-5">

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex gap-3 items-center mb-4">
                                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                                <h2 className="font-semibold text-slate-700">Paciente</h2>
                            </div>

                            <p className="text-sm text-slate-500">Nombre</p>
                            <p className="font-medium text-slate-700 mb-3">
                                {hospitalitationData.patient.fullname}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                            <p className="text-blue-700 font-semibold">
                                Hospitalización activa
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                El paciente continúa en observación médica
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            <Modal
                abierto={openDischarge}
                onClose={() => setOpenDischarge(false)}
                titulo="Egreso hospitalario"
                size="md"
            >
                <div className="space-y-5">

                    <FormField label="Fecha de egreso">
                        <Input
                            type="date"
                            value={form.dischargeDate}
                            onChange={(e) =>
                                setForm({ ...form, dischargeDate: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Motivo de egreso">
                        <Input
                            value={form.motive}
                            onChange={(e) =>
                                setForm({ ...form, motive: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Observaciones">
                        <Input
                            value={form.observations}
                            onChange={(e) =>
                                setForm({ ...form, observations: e.target.value })
                            }
                        />
                    </FormField>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            label="Cancelar"
                            color="gray"
                            variant="outline"
                            onClick={() => setOpenDischarge(false)}
                        />

                        <Button
                            icon={faArrowRightFromBracket}
                            label={saving ? "Guardando..." : "Confirmar egreso"}
                            color="green"
                            onClick={handleDischarge}
                        />
                    </div>

                </div>
            </Modal>

            <div className="fixed top-4 right-4 z-[99999]">
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

export default HospitalizationDetailsPage;