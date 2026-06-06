import { useMemo, useState } from "react";

import DataTable from "@/shared/components/DataTable";
import type { TableAction } from "@/shared/types/table/TableTypes";
import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { BUTTON_COLORS } from "@/shared/types/button/ButtonTypes";
import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";

import {
  faUserPlus,
  faEye,
  faPen,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import type { Patient } from "@/modules/patients/domain/entities/Patient";
import { usePatientPaginated } from "@/modules/patients/hooks/usePatientPaginated";

const PatientsPage = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [gender, setGender] = useState("all");

  const { items: patients, totalElements } =
    usePatientPaginated(page - 1, pageSize);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        p.telefono.toString().includes(search);

      const matchesGender =
        gender === "all" ? true : p.genero === gender;

      const matchesStatus = true;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [patients, search, gender]);

  const formattedPatients = useMemo(() => {
    return filteredPatients.map((p) => ({
      ...p,
      generoLabel:
        p.genero === "M"
          ? "Masculino"
          : p.genero === "F"
          ? "Femenino"
          : p.genero
    }));
  }, [filteredPatients]);

  const toggleStatus = (id: number) => {
    showToast("Acción pendiente backend", TOAST_TYPES.SUCCESS);
  };

  const actions: TableAction<Patient>[] = [
    {
      title: "Ver expediente",
      label: "Ver",
      icon: faEye,
      color: BUTTON_COLORS.GRAY,
      permission: PERMISSIONS.PATIENT.VIEW_DETAIL,
      onClick: (patient) =>
        navigate(`/admin/patients/${patient.id}`, {
          state: { patient }
        })
    },
    {
      title: "Editar paciente",
      label: "Editar",
      icon: faPen,
      color: BUTTON_COLORS.BLUE,
      permission: PERMISSIONS.PATIENT.EDIT,
      onClick: (patient) =>
        navigate(`/admin/patients/${patient.id}/edit`, {
          state: { patient }
        })
    }
  ];

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Pacientes
            </h1>
            <p className="text-sm text-slate-500">
              Gestión de pacientes del sistema
            </p>
          </div>

          <Button
            icon={faUserPlus}
            label="Nuevo paciente"
            color="blue"
            onClick={() => navigate("create")}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Buscar">
              <Input
                placeholder="Nombre, expediente o teléfono"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormField>

            <FormField label="Estado">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </Select>
            </FormField>

            <FormField label="Género">
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </Select>
            </FormField>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable<any>
            columns={[
              { key: "nombre", label: "Nombre", sortable: true },
              { key: "apellido", label: "Apellidos", sortable: true },
              {
                key: "fechaNacimiento",
                label: "Fecha de Nacimiento",
                hasInput: true, 
                inputType: "date",
                // sortable: true
              },
              {
                key: "generoLabel",
                label: "Género",
                sortable: true
              },
              { key: "actions", label: "Acciones", hasActions: true }
            ]}
            data={formattedPatients}
            actions={actions}
            page={page}
            pageSize={pageSize}
            total={totalElements}
            onPageChange={setPage}
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

export default PatientsPage;