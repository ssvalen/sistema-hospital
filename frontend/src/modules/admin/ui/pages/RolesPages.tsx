import DataTable from "@/shared/components/DataTable";
import type { Role, Permission } from "../../types/AuthTypes";
import type { TableAction } from "@/shared/types/table/TableTypes";
import { BUTTON_COLORS } from "@/shared/types/button/ButtonTypes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/shared/components/forms/Button";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";

const RolesPages = () => {
  const navigate = useNavigate();

  const permissions: Permission[] = [
    { id: "p1", name: "Ver pacientes", code: "patients.view" },
    { id: "p2", name: "Crear pacientes", code: "patients.create" },
    { id: "p3", name: "Editar pacientes", code: "patients.edit" },
    { id: "p4", name: "Eliminar pacientes", code: "patients.delete" },
    { id: "p5", name: "Ver roles", code: "roles.view" },
    { id: "p6", name: "Gestionar roles", code: "roles.manage" },
  ];

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrador",
      description: "Acceso total al sistema",
      permissions: [permissions[0], permissions[1], permissions[4], permissions[5]],
    },
    {
      id: "2",
      name: "Doctor",
      description: "Gestión clínica de pacientes",
      permissions: [permissions[0], permissions[1], permissions[2]],
    },
    {
      id: "3",
      name: "Recepcionista",
      description: "Agenda y citas",
      permissions: [permissions[0]],
    },
  ]);

  const toggleActive = (roleId: string) => {
    setRoles((prev) =>
      prev.map((r: any) =>
        r.id === roleId ? { ...r, active: !r.active } : r
      )
    );
  };

  const actions: TableAction<Role>[] = [
    {
      title: "Editar rol",
      label: "Editar",
      color: BUTTON_COLORS.BLUE,
      onClick: (role) => navigate(`/admin/roles/${role.id}`, {
        state: { role, permissions }
      }),
    },
    {
      title: "Inactivar rol",
      label: "Inactivar",
      color: BUTTON_COLORS.RED,
      onClick: (role) => toggleActive(role.id),
    },
  ];

  const columns = [
    { key: "name", label: "Rol", sortable: true },
    { key: "description", label: "Descripción" },
    { key: "actions", label: "Acciones", hasActions: true },
  ];

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Roles</h1>
          <p className="text-sm text-slate-500">
            Administración de roles del sistema
          </p>
        </div>
        <Button
          label="Crear rol"
          icon={faUserLock}
          color="blue"
          onClick={() => navigate("/admin/roles/new", {
            state: { permissions }
          })} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DataTable<Role>
          columns={columns}
          data={roles}
          actions={actions}
          page={1}
          pageSize={10}
          total={roles.length}
          onPageChange={() => { }}
        />
      </div>

    </div>
  );
};

export default RolesPages;