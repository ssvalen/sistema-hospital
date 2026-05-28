import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";

import type { Appointment } from "../../types/AppointmentTypes";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "Juan Pérez",
    doctorId: "d1",
    doctorName: "Dr. López",
    start: "2026-05-10T09:00:00",
    end: "2026-05-10T09:30:00",
    reason: "Control general",
    status: "scheduled",
  },
];

export default function AppointmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();

  const edit = Boolean(id);

  const existing = mockAppointments.find((a) => a.id === id);

  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    start: "",
    end: "",
    reason: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (edit && existing) {
      setForm(existing);
    } else {
      const start = params.get("start");
      const end = params.get("end");

      if (start && end) {
        setForm((p) => ({ ...p, start, end }));
      }
    }
  }, []);

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <h1 className="text-2xl font-semibold text-slate-800">
        {edit ? "Editar cita" : "Nueva cita"}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 grid md:grid-cols-2 gap-5">

        <FormField label="Paciente">
          <Input
            value={form.patientName}
            onChange={(e) =>
              setForm({ ...form, patientName: e.target.value })
            }
          />
        </FormField>

        <FormField label="Médico">
          <Select
            value={form.doctorId}
            onChange={(e) =>
              setForm({ ...form, doctorId: e.target.value })
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
              setForm({ ...form, start: e.target.value })
            }
          />
        </FormField>

        <FormField label="Fin">
          <Input
            type="datetime-local"
            value={form.end}
            onChange={(e) =>
              setForm({ ...form, end: e.target.value })
            }
          />
        </FormField>

        <FormField label="Motivo">
          <Input
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
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
          onClick={() =>
            navigate("/admin/appointments")
          }
        />
      </div>

    </div>
  );
}