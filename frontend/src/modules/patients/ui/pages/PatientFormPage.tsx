import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";

import { useCreatePatient } from "@/modules/patients/hooks/useCreatePatient";
import { useUpdatePatient } from "@/modules/patients/hooks/useUpdatePatient";
import { usePatientById } from "@/modules/patients/hooks/usePatientById";

type PatientForm = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  direccion: string;
  genero: "M" | "F" | "";
};

const emptyForm: PatientForm = {
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  telefono: "",
  direccion: "",
  genero: "",
};

const PatientFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;
  const numericId = id ? Number(id) : undefined;

  const { toast, showToast, hideToast } = useToast();

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const { data: patientData } = usePatientById(numericId, {
    enabled: isEdit && !!numericId,
  });

  const initialForm = useMemo(() => {
    if (!isEdit || !patientData) return emptyForm;

    return {
      nombre: patientData.nombre,
      apellido: patientData.apellido,
      fechaNacimiento: patientData.fechaNacimiento,
      telefono: String(patientData.telefono),
      direccion: patientData.direccion,
      genero: patientData.genero,
    };
  }, [patientData, isEdit]);

  const [form, setForm] = useState<PatientForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleChange = (key: keyof PatientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.nombre.trim()) {
      showToast("Nombre obligatorio", TOAST_TYPES.ERROR);
      return false;
    }

    if (!form.apellido.trim()) {
      showToast("Apellido obligatorio", TOAST_TYPES.ERROR);
      return false;
    }

    if (!form.fechaNacimiento) {
      showToast("Fecha de nacimiento obligatoria", TOAST_TYPES.ERROR);
      return false;
    }

    if (!form.telefono.trim()) {
      showToast("Teléfono obligatorio", TOAST_TYPES.ERROR);
      return false;
    }

    if (!form.direccion.trim()) {
      showToast("Dirección obligatoria", TOAST_TYPES.ERROR);
      return false;
    }

    if (!form.genero) {
      showToast("Género obligatorio", TOAST_TYPES.ERROR);
      return false;
    }

    return true;
  };

  const save = async () => {
    if (!validate()) return;

    setSaving(true);

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      fechaNacimiento: form.fechaNacimiento,
      telefono: Number(form.telefono),
      direccion: form.direccion,
      genero: form.genero as "M" | "F",
    };

    try {
      if (isEdit && numericId) {
        await updatePatient.mutateAsync({
          id: numericId,
          ...payload,
        });
      } else {
        await createPatient.mutateAsync(payload);
      }

      showToast(
        isEdit ? "Paciente actualizado" : "Paciente creado",
        TOAST_TYPES.SUCCESS
      );

      navigate("/admin/patients", {
        state: {
          toast: {
            type: TOAST_TYPES.SUCCESS,
            message: isEdit
              ? "Paciente actualizado"
              : "Paciente creado",
          },
        },
      });
    } catch {
      showToast("Error al guardar paciente", TOAST_TYPES.ERROR);
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
              {isEdit ? "Editar paciente" : "Nuevo paciente"}
            </h1>

            <p className="text-sm text-slate-500">
              {isEdit
                ? "Actualiza la información del paciente"
                : "Registro de nuevo paciente"}
            </p>
          </div>

          <Button
            icon={faArrowLeft}
            label="Volver"
            color="gray"
            variant="outline"
            onClick={() => navigate("/admin/patients")}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-5">
              Información personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Nombres">
                <Input
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                />
              </FormField>

              <FormField label="Apellidos">
                <Input
                  value={form.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                />
              </FormField>

              <FormField label="Género">
                <Select
                  value={form.genero}
                  onChange={(e) => handleChange("genero", e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </Select>
              </FormField>

              <FormField label="Fecha nacimiento">
                <Input
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) =>
                    handleChange("fechaNacimiento", e.target.value)
                  }
                />
              </FormField>

              <FormField label="Teléfono">
                <Input
                  value={form.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
              </FormField>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-5">
              Contacto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <FormField label="Dirección">
                  <Input
                    value={form.direccion}
                    onChange={(e) =>
                      handleChange("direccion", e.target.value)
                    }
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              label="Cancelar"
              color="gray"
              variant="outline"
              onClick={() => navigate("/admin/patients")}
            />

            <Button
              icon={faSave}
              label={
                saving
                  ? "Guardando..."
                  : isEdit
                  ? "Actualizar"
                  : "Guardar"
              }
              color="blue"
              onClick={save}
            />
          </div>
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

export default PatientFormPage;