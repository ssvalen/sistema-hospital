import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Button from "@/shared/components/forms/Button";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

import type { Appointment } from "../../types/AppointmentTypes";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "Juan Pérez",
    doctorId: "d1",
    doctorName: "Dr. López",
    start: "2026-05-28T09:00:00",
    end: "2026-05-28T09:30:00",
    reason: "Control general",
    status: "scheduled",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "María López",
    doctorId: "d2",
    doctorName: "Dra. Méndez",
    start: "2026-05-10T10:00:00",
    end: "2026-05-10T10:30:00",
    reason: "Seguimiento",
    status: "completed",
  },
];

export default function AppointmentCalendarPage() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("all");

  const events = useMemo(() => {
    return mockAppointments
      .filter((a) =>
        doctorId === "all" ? true : a.doctorId === doctorId
      )
      .map((a) => ({
        id: a.id,
        title: `${a.patientName} - ${a.reason}`,
        start: a.start,
        end: a.end,
        extendedProps: a,
        backgroundColor:
          a.status === "cancelled"
            ? "#ef4444"
            : a.status === "completed"
            ? "#10b981"
            : "#2563eb",
      }));
  }, [doctorId]);

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Citas médicas
          </h1>
          <p className="text-sm text-slate-500">
            Agenda clínica del sistema
          </p>
        </div>

        <Button
          icon={faPlus}
          label="Nueva cita"
          color="blue"
          onClick={() => navigate("/admin/appointments/new")}
        />
      </div>


      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <FormField label="Médico">
          <Select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="d1">Dr. López</option>
            <option value="d2">Dra. Méndez</option>
          </Select>
        </FormField>
      </div>


      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          height="75vh"
          events={events}
          selectable
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}

          eventClick={(info) => {
            navigate(`/admin/appointments/${info.event.id}`);
          }}

          select={(info) => {
            navigate(
              `/admin/appointments/new?start=${info.start.toISOString()}&end=${info.end?.toISOString()}`
            );
          }}
        />
      </div>
    </div>
  );
}