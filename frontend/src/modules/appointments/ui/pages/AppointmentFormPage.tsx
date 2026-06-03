import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import DataList from "@/shared/components/forms/DataList";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { TOAST_CONFIG } from "@/shared/types/ToastConfig";

import { APPOINTMENT_STATUS } from "../../types/AppointmentStatus";

import { useCreateAppointment } from "../../hooks/appointments/useCreateAppointment";
import { useUpdateAppointment } from "../../hooks/appointments/useUpdateAppointment";
import { useAppointmentById } from "../../hooks/appointments/useAppointmentById";
import { useGetAllPatients } from "../../../patients/hooks/useGetAllPatients";
import { useGetAllDoctors } from "@/modules/hospital/hooks/doctor/useGetAllDoctors";

type FormState = {
  patientId: string;
  doctorId: string;
  start: string;
  status: string;
};

type Option = {
  id: string;
  label: string;
  subtitle?: string;
};

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!form.patientId.trim()) {
    errors.patientId = "Debe seleccionar un paciente";
  }

  if (!form.doctorId.trim()) {
    errors.doctorId = "Debe seleccionar un médico";
  }

  if (!form.start.trim()) {
    errors.start = "Debe ingresar una fecha";
  } else {
    const appointmentDate = new Date(form.start);
    const now = new Date();

    if (appointmentDate <= now) {
      errors.start =
        "La fecha de la cita debe ser posterior a la fecha actual";
    }
  }

  return errors;
}

function formatAppointmentDate(dateTimeLocal: string) {
  const date = new Date(dateTimeLocal);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default function AppointmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast, showToast, hideToast } = useToast();
  const edit = Boolean(id);

  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const { data: appointment } = useAppointmentById(Number(id));

  const { data: patients } = useGetAllPatients(!edit);
  const { data: doctors } = useGetAllDoctors();

  const context = (location.state || {}) as {
    patientId?: string;
    patientName?: string;
    patientCode?: string;
    start?: string;
  };

  const [form, setForm] = useState<FormState>({
    patientId: context.patientId ?? "",
    doctorId: "",
    start: "",
    status: APPOINTMENT_STATUS.SCHEDULED,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (!appointment || !edit) return;

    setForm({
      patientId: String(appointment.patient.id),
      doctorId: String(appointment.doctor.id),
      start: `${appointment.startDate}T${appointment.startTime.slice(0, 5)}`,
      status: appointment.status,
    });
  }, [appointment, edit]);

  useEffect(() => {
    if (context.patientId) {
      setForm((prev) => ({
        ...prev,
        patientId: context.patientId ?? "",
      }));
    }

    if (context.start) {
      setForm((prev) => ({
        ...prev,
        start: context.start ?? "",
      }));
    }


  }, [context]);

  useEffect(() => {
    if (
      edit &&
      appointment &&
      appointment.status !==
      APPOINTMENT_STATUS.SCHEDULED
    ) {
      // navigate(
      //   `/admin/appointments/${appointment.id}`
      // );
    }
  }, [appointment, edit, navigate]);

  const patientOptions: Option[] = edit
    ? appointment
      ? [
        {
          id: String(appointment.patient.id),
          label: appointment.patient.fullName,
        },
      ]
      : []
    : patients?.map((patient) => ({
      id: String(patient.id),
      label: `${patient.nombre} ${patient.apellido}`,
      subtitle: String(patient.telefono),
    })) ?? [];

  const selectedPatient: Option | null = edit
    ? appointment
      ? {
        id: String(appointment.patient.id),
        label: appointment.patient.fullName,
      }
      : null
    : context.patientId && context.patientName
      ? {
        id: context.patientId,
        label: context.patientName,
        subtitle: context.patientCode,
      }
      : patientOptions.find(
        (patient) => patient.id === form.patientId
      ) ?? null;


  const doctorOptions: Option[] =
    doctors?.map((doctor) => ({
      id: String(doctor.id),
      label: doctor.fullName,
      subtitle: doctor.speciality,
    })) ?? [];

  const selectedDoctor: Option | null =
    doctorOptions.find(
      (doctor) => doctor.id === form.doctorId
    ) ??
    (appointment
      ? {
        id: String(appointment.doctor.id),
        label: appointment.doctor.fullName,
        subtitle: appointment.doctor.specialty,
      }
      : null);

  const handleSave = async () => {
    const validationErrors = validate(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      patientId: Number(form.patientId),
      medicId: Number(form.doctorId),
      appointmentDate: formatAppointmentDate(form.start),
      appointmentStatus: (edit) ? APPOINTMENT_STATUS.RESCHEDULED : APPOINTMENT_STATUS.SCHEDULED,
    };

    try {
      if (edit && id) {
        await updateAppointment.mutateAsync({
          id: Number(id),
          ...payload,
        });

        showToast(
          "Cita actualizada correctamente",
          TOAST_TYPES.SUCCESS
        );

        setTimeout(() => {
          navigate(-1);
        }, TOAST_CONFIG.success.duration);

        return;
      }

      await createAppointment.mutateAsync(payload);

      showToast(
        "Cita creada correctamente",
        TOAST_TYPES.SUCCESS
      );

      setTimeout(() => {
        navigate("/admin/appointments");
      }, TOAST_CONFIG.success.duration);

    } catch (error: any) {
      showToast(
        "Ocurrió un error al guardar la cita",
        TOAST_TYPES.ERROR
      );
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        {edit ? "Editar cita" : "Nueva cita"}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 grid md:grid-cols-2 gap-5">
        <FormField label="Paciente">
          <DataList
            options={patientOptions}
            value={selectedPatient}
            disabled={edit || !!context.patientId}
            onChange={(option) =>
              setForm((prev) => ({
                ...prev,
                patientId: option?.id ?? "",
              }))
            }
          />

          {errors.patientId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.patientId}
            </p>
          )}
        </FormField>

        <FormField label="Médico">
          <DataList
            options={doctorOptions}
            value={selectedDoctor}
            onChange={(option) =>
              setForm((prev) => ({
                ...prev,
                doctorId: option?.id ?? "",
              }))
            }
          />

          {errors.doctorId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.doctorId}
            </p>
          )}
        </FormField>

        <FormField label="Inicio">
          <Input
            type="datetime-local"
            value={form.start}
            invalid={!!errors.start}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                start: e.target.value,
              }))
            }
          />

          {errors.start && (
            <p className="text-sm text-red-500 mt-1">
              {errors.start}
            </p>
          )}
        </FormField>

      </div>

      <div className="flex justify-end gap-3">
        <Button
          label="Cancelar"
          color="gray"
          onClick={() => navigate("/admin/appointments")}
        />

        <Button
          label={edit ? "Actualizar" : "Guardar"}
          color="blue"
          onClick={handleSave}
          disabled={
            createAppointment.isPending ||
            updateAppointment.isPending
          }
        />
      </div>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}