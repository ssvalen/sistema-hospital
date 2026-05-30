import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Button from "@/shared/components/forms/Button";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import DataTable from "@/shared/components/DataTable";
import CanAccess from "@/shared/components/permissions/CanAccess";

import { APPOINTMENT_PERMISSIONS, type AppointmentPermission } from "../utils/appointmentsPermissions";

import {
  faCalendarDays,
  faTable,
  faEye,
  faStethoscope
} from "@fortawesome/free-solid-svg-icons";

import type { TableAction } from "@/shared/types/table/TableTypes";

type Appointment = {
  id: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  start: string;
  end: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
};

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Juan Pérez",
    doctorId: "d1",
    doctorName: "Dr. López",
    start: "2026-05-28T09:00:00",
    end: "2026-05-28T09:30:00",
    reason: "Control general",
    status: "scheduled"
  },
  {
    id: "2",
    patientName: "María López",
    doctorId: "d2",
    doctorName: "Dra. Méndez",
    start: "2026-05-28T10:00:00",
    end: "2026-05-28T10:30:00",
    reason: "Seguimiento",
    status: "completed"
  }
];

export default function AppointmentCalendarPage() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("all");
  const [view, setView] = useState<"calendar" | "table">("calendar");

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(a =>
      doctorId === "all" ? true : a.doctorId === doctorId
    );
  }, [doctorId]);

  const events = useMemo(() => {
    return filteredAppointments.map(a => ({
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
            : a.status === "in_progress"
              ? "#f59e0b"
              : "#2563eb"
    }));
  }, [filteredAppointments]);

  const columns = [
    { key: "patientName", label: "Paciente" },
    { key: "doctorName", label: "Médico" },
    { key: "start", label: "Fecha" },
    { key: "reason", label: "Motivo" },
    { key: "status", label: "Estado" },
    { key: "actions", label: "Acciones", hasActions: true }
  ];

  const actions: TableAction<Appointment>[] = [
    {
      title: "Ver",
      permission: APPOINTMENT_PERMISSIONS.VIEW_DETAIL,
      color: "blue",
      icon: faEye,
      onClick: (row) =>
        navigate(`/admin/appointments/${row.id}`)
    },
    {
      title: "Atender",
      permission: APPOINTMENT_PERMISSIONS.ATTEND,
      color: "green",
      icon: faStethoscope,
      onClick: (row) =>
        navigate(`/admin/appointments/${row.id}/attend`)
    }
  ];

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Citas médicas
          </h1>
          <p className="text-sm text-slate-500">
            Agenda clínica del sistema
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            icon={faCalendarDays}
            label="Calendario"
            color={view === "calendar" ? "blue" : "gray"}
            onClick={() => setView("calendar")}
          />
          <Button
            icon={faTable}
            label="Tabla"
            color={view === "table" ? "blue" : "gray"}
            onClick={() => setView("table")}
          />
        </div>
      </div>

      <CanAccess
        permission={APPOINTMENT_PERMISSIONS.FILTER}
      >
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="max-w-xs">
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
        </div>
      </CanAccess>

      {view === "calendar" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            height="72vh"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            eventClick={(info) =>
              navigate(`/admin/appointments/${info.event.id}`)
            }
            select={(info) =>
              navigate(
                `/admin/appointments/new?start=${info.start.toISOString()}&end=${info.end?.toISOString()}`
              )
            }
          />
        </div>
      )}

      {view === "table" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredAppointments}
            actions={actions}
            page={1}
            pageSize={10}
            total={filteredAppointments.length}
            onPageChange={() => { }}
          />
        </div>
      )}

    </div>
  );
}