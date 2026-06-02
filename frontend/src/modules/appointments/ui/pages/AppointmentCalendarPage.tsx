import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import Button from "@/shared/components/forms/Button";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import DataTable from "@/shared/components/DataTable";
import CanAccess from "@/shared/components/permissions/CanAccess";

import { APPOINTMENT_PERMISSIONS } from "../utils/appointmentsPermissions";


import {
  faCalendarDays,
  faTable,
  faEye,
  faStethoscope,
  faPlus,
  faCalendarPlus
} from "@fortawesome/free-solid-svg-icons";

import type { TableAction } from "@/shared/types/table/TableTypes";
import { PERMISSIONS } from "@/shared/utils/permissions";
import { useAccess } from "@/shared/hooks/useAccess";
import { useAppointmentsCalendar } from "../../hooks/useAppointmentsCalendar";
import { useAppointmentsTable } from "../../hooks/useAppointmentsTable";

import type { Appointment as DomainAppointment } from "@/modules/appointments/domain/entities/Appointment";

/**
 * UI model (para pantalla calendario/tabla)
 */
type AppointmentUI = {
  id: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  start: string;
  end: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
};

const normalizeAppointment = (a: DomainAppointment): AppointmentUI => ({
  id: String(a.id),
  patientName: `${a.patient.firstName} ${a.patient.lastName}`,
  doctorId: String(a.doctor.id),
  doctorName: a.doctor.fullName,
  start: a.startDate,
  end: a.startDate,
  reason: "",
  status: a.status as AppointmentUI["status"],
});

export default function AppointmentCalendarPage() {
  const navigate = useNavigate();

  const { toast, showToast, hideToast } = useToast();

  const [doctorId, setDoctorId] = useState("all");
  const [view, setView] = useState<"calendar" | "table">("calendar");

  const [page] = useState(1);
  const pageSize = 10;

  const selectedMedicId =
    doctorId !== "all" ? Number(doctorId) : undefined;

  const canViewAllAppointments = useAccess({
    permissions: [PERMISSIONS.APPOINTMENT.VIEW_ALL_APPOINTMENTS]
  });

  const calendarQuery = useAppointmentsCalendar({
    canViewAll: canViewAllAppointments,
    medicId: selectedMedicId
  });

  const tableQuery = useAppointmentsTable({
    page: page - 1,
    size: pageSize,
    canViewAll: canViewAllAppointments,
    medicId: selectedMedicId
  });

  console.log("table data", tableQuery.data);
  console.log("table error", tableQuery.error);

  const appointments: AppointmentUI[] = useMemo(() => {
    if (view === "calendar") {
      return (calendarQuery.data ?? []).map(normalizeAppointment);
    }

    const data = tableQuery.data;

    if (!data) return [];

    if (Array.isArray(data)) {
      return data.map(normalizeAppointment);
    }

    return data.content.map(normalizeAppointment);
  }, [view, calendarQuery.data, tableQuery.data]);

  const filteredAppointments: AppointmentUI[] = useMemo(() => {
    return appointments.filter((a) =>
      doctorId === "all" ? true : a.doctorId === doctorId
    );
  }, [appointments, doctorId]);

  const events = useMemo(() => {
    return filteredAppointments.map((a) => ({
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

  const actions: TableAction<AppointmentUI>[] = [
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


      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-end justify-between gap-4">

          <div className="max-w-xs w-full">
            <CanAccess permission={APPOINTMENT_PERMISSIONS.FILTER}>
              <FormField label="Médico">
                <Select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="1">Dr. López</option>
                  <option value="2">Dra. Méndez</option>
                </Select>
              </FormField>
           </CanAccess>
        </div>

        <CanAccess permission={APPOINTMENT_PERMISSIONS.CREATE}>
          <Button
            icon={faCalendarPlus}
            label="Crear cita"
            color="green"
            onClick={() => navigate("new")}
          />
        </CanAccess>

      </div>
    </div>
      

      {
    view === "calendar" && (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable
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
          select={(info) => {
            const now = new Date();
            const start = new Date(info.start);


            if (start.getTime() < now.setSeconds(0, 0)) {
              console.log("aq")
              showToast("No puedes crear citas en el pasado", TOAST_TYPES.ERROR);
              return;
            }

            navigate("/admin/appointments/new", {
              state: {
                start: info.start.toISOString(),
                end: info.end?.toISOString() ?? null
              }
            })
          }
          }
        />
      </div>
    )
  }

  {
    view === "table" && (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DataTable
          columns={[
            { key: "patientName", label: "Paciente" },
            { key: "doctorName", label: "Médico" },
            { key: "start", label: "Fecha" },
            { key: "reason", label: "Motivo" },
            { key: "status", label: "Estado" },
            { key: "actions", label: "Acciones", hasActions: true }
          ]}
          data={filteredAppointments}
          actions={actions}
          page={page}
          pageSize={pageSize}
          total={
            tableQuery.data &&
              !Array.isArray(tableQuery.data) &&
              "totalElements" in tableQuery.data
              ? tableQuery.data.totalElements
              : filteredAppointments.length
          }
          onPageChange={() => { }}
        />
      </div>
    )
  }
  <Toast
    show={toast.show}
    type={toast.type}
    message={toast.message}
    onClose={hideToast}
  />
    </div >
  );
}