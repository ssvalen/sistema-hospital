import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import DataList from "@/shared/components/forms/DataList";

type Patient = {
  id: string;
  name: string;
  code: string;
};

const mockPatients: Patient[] = [
  { id: "p1", name: "Juan Pérez", code: "EXP-0001" },
  { id: "p2", name: "María López", code: "EXP-0002" },
  { id: "p3", name: "Carlos Ruiz", code: "EXP-0003" }
];

type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  start: string;
  end: string;
  reason: string;
  status: string;
};

const mockAppointments: Record<string, Appointment> = {
  "1": {
    id: "1",
    patientId: "p1",
    doctorId: "d1",
    start: "2026-05-10T09:00",
    end: "2026-05-10T09:30",
    reason: "Control general",
    status: "scheduled"
  }
};

type FormState = {
  patientId: string;
  doctorId: string;
  start: string;
  end: string;
  reason: string;
  status: string;
};

export default function AppointmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const edit = Boolean(id);

  const context = (location.state || {}) as {
    patientId?: string;
    patientName?: string;
    start?: string;
    end?: string;
  };

  const [form, setForm] = useState<FormState>({
    patientId: "",
    doctorId: "",
    start: "",
    end: "",
    reason: "",
    status: "scheduled"
  });

  useEffect(() => {
    if (edit && id) {
      const appointment = mockAppointments[id];

      if (!appointment) return;

      setForm({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        start: appointment.start,
        end: appointment.end,
        reason: appointment.reason,
        status: appointment.status
      });

      return;
    }

    setForm((prev) => ({
      ...prev,
      patientId: context.patientId ?? "",
      start: context.start ?? "",
      end: context.end ?? ""
    }));
  }, [
    edit,
    id,
    context.patientId,
    context.start,
    context.end
  ]);

  const selectedPatient = useMemo(() => {
    if (!form.patientId && !context.patientName) {
      return null;
    }

    const byId = mockPatients.find(
      (p) => p.id === form.patientId
    );

    if (byId) return byId;

    const byName = mockPatients.find(
      (p) => p.name === context.patientName
    );

    return byName ?? null;
  }, [form.patientId, context.patientName]);

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <h1 className="text-2xl font-semibold text-slate-800">
        {edit ? "Editar cita" : "Nueva cita"}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 grid md:grid-cols-2 gap-5">

        <FormField label="Paciente">
          <DataList
            options={mockPatients.map((p) => ({
              id: p.id,
              label: p.name,
              subtitle: p.code
            }))}
            value={
              selectedPatient
                ? {
                    id: selectedPatient.id,
                    label: selectedPatient.name,
                    subtitle: selectedPatient.code
                  }
                : null
            }
            onChange={(option) =>
              setForm((f) => ({
                ...f,
                patientId: option?.id || ""
              }))
            }
            placeholder="Buscar paciente..."
          />
        </FormField>

        <FormField label="Médico">
          <Select
            value={form.doctorId}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                doctorId: e.target.value
              }))
            }
          >
            <option value="">Seleccionar</option>
            <option value="d1">Dr. López</option>
            <option value="d2">Dra. Méndez</option>
          </Select>
        </FormField>

        <FormField label="Inicio">
          <Input
            type="datetime-local"
            value={form.start}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                start: e.target.value
              }))
            }
          />
        </FormField>

        <FormField label="Fin">
          <Input
            type="datetime-local"
            value={form.end}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                end: e.target.value
              }))
            }
          />
        </FormField>

        <FormField label="Motivo">
          <Input
            value={form.reason}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                reason: e.target.value
              }))
            }
          />
        </FormField>

      </div>

      <div className="flex justify-end gap-3">

        <Button
          label="Cancelar"
          color="gray"
          onClick={() => navigate("/admin/appointments")}
        />

        <Button
          label="Guardar"
          color="blue"
          onClick={() => {
            console.log(form);
            navigate("/admin/appointments");
          }}
        />

      </div>

    </div>
  );
}