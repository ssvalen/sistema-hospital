import { useMemo, useState } from "react";

import DataTable from "@/shared/components/DataTable";
import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import {
  faUserPlus,
  faEye,
  faPen,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

type Patient = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  age: number;
  phone: string;
  active: boolean;
};

const PatientsPage = () => {
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [gender, setGender] = useState("all");

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      code: "EXP-000001",
      firstName: "Juan",
      lastName: "Pérez",
      gender: "M",
      age: 35,
      phone: "5555-1111",
      active: true
    },
    {
      id: "2",
      code: "EXP-000002",
      firstName: "María",
      lastName: "López",
      gender: "F",
      age: 29,
      phone: "5555-2222",
      active: true
    },
    {
      id: "3",
      code: "EXP-000003",
      firstName: "Carlos",
      lastName: "Ruiz",
      gender: "M",
      age: 41,
      phone: "5555-3333",
      active: false
    }
  ]);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName =
        `${p.firstName} ${p.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        p.code
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        p.phone.includes(search);

      const matchesStatus =
        status === "all"
          ? true
          : status === "active"
            ? p.active
            : !p.active;

      const matchesGender =
        gender === "all"
          ? true
          : p.gender === gender;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGender
      );
    });
  }, [patients, search, status, gender]);

  const toggleStatus = (id: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            active: !p.active
          }
          : p
      )
    );

    showToast(
      "Estado actualizado",
      TOAST_TYPES.SUCCESS
    );
  };

  const actions = useMemo(
    () => [
      {
        title: "Ver",
        label: "Ver",
        color: "gray",
        icon: faEye,
        onClick: (p: Patient) => {
          navigate(`/admin/patients/${p.id}`);
        }
      },
      {
        title: "Editar",
        label: "Editar",
        color: "blue",
        icon: faPen,
        onClick: (p: Patient) => {
          navigate(`/admin/patients/${p.id}/edit`);
        }
      },
      {
        title: "Estado",
        label: "Estado",
        color: "red",
        icon: faUserSlash,
        onClick: (p: Patient) =>
          toggleStatus(p.id)
      }
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        key: "code",
        label: "Expediente"
      },
      {
        key: "name",
        label: "Paciente",
        render: (row: Patient) => (
          <div>
            <div className="font-medium text-slate-700">
              {row.firstName} {row.lastName}
            </div>

            <div className="text-xs text-slate-400">
              {row.gender === "M"
                ? "Masculino"
                : "Femenino"}
            </div>
          </div>
        )
      },
      {
        key: "age",
        label: "Edad",
        render: (row: Patient) => (
          <span>{row.age} años</span>
        )
      },
      {
        key: "phone",
        label: "Teléfono"
      },
      {
        key: "active",
        label: "Estado",
        render: (row: Patient) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${row.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {row.active
              ? "Activo"
              : "Inactivo"}
          </span>
        )
      },
      {
        key: "actions",
        label: "Acciones",
        hasActions: true
      }
    ],
    []
  );

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
            onClick={() => navigate('create')}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Buscar">
              <Input
                placeholder="Nombre, expediente o teléfono"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Estado">
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  Todos
                </option>

                <option value="active">
                  Activos
                </option>

                <option value="inactive">
                  Inactivos
                </option>
              </Select>
            </FormField>

            <FormField label="Género">
              <Select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  Todos
                </option>

                <option value="M">
                  Masculino
                </option>

                <option value="F">
                  Femenino
                </option>
              </Select>
            </FormField>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredPatients}
            actions={actions as any}
            page={1}
            pageSize={10}
            total={filteredPatients.length}
            onPageChange={() => { }}
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