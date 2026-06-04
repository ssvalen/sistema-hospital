import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
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

import type { HospitalitationEgressRequestParams } from "../../types/HospitalitationTypes";

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

  const [motive, setMotive] = useState("");
  const [observations, setObservations] = useState("");

  const hospitalizationDays = useMemo(() => {
    const start = new Date(hospitalization.admissionDate);
    const end = new Date();

    return Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
  }, [hospitalization.admissionDate]);

  const validate = () => {
    if (!motive.trim()) {
      showToast("Ingrese motivo de egreso", TOAST_TYPES.ERROR);
      return false;
    }

    if (!observations.trim()) {
      showToast("Ingrese observaciones", TOAST_TYPES.ERROR);
      return false;
    }

    return true;
  };

  const dischargePatient = () => {
    if (!validate()) return;

    setSaving(true);

    const payload: HospitalitationEgressRequestParams = {
      hospitalitationId: Number(id),
      motive: motive.trim(),
      status: "EGRESADO",
      observations: observations.trim()
    };

    setTimeout(() => {
      console.log(payload);

      showToast("Egreso registrado correctamente", TOAST_TYPES.SUCCESS);
      setSaving(false);
      navigate("/admin/hospitalizations");
    }, 900);
  };

  return (
  <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
    
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Egreso hospitalario
        </h1>
        <p className="text-sm text-slate-500">
          Registrar salida del paciente
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

    <div className="max-w-3xl mx-auto space-y-6">

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        
        <div className="mb-6">
          <p className="text-sm text-slate-400">Paciente</p>
          <p className="text-lg font-semibold text-slate-800">
            Juan Pérez
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">

          <FormField label="Motivo de egreso">
            <Input
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              placeholder="Alta médica, referencia, traslado..."
            />
          </FormField>

          <FormField label="Observaciones clínicas">
            <Input
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Estado final del paciente..."
            />
          </FormField>

        </div>

      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <p className="text-emerald-700 font-medium">
          Esta acción finalizará la hospitalización del paciente.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          label="Cancelar"
          color="gray"
          variant="outline"
          onClick={() => navigate(-1)}
        />

        <Button
          icon={faArrowRightFromBracket}
          label={saving ? "Procesando..." : "Registrar egreso"}
          color="green"
          onClick={dischargePatient}
        />
      </div>

    </div>
  </div>
);
};

export default DischargeHospitalizationPage;