import DataTable from "@/shared/components/DataTable";
import type { Role } from "@/modules/admin/domain/entities/Role";
import type { TableAction } from "@/shared/types/table/TableTypes";
import { BUTTON_COLORS } from "@/shared/types/button/ButtonTypes";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/forms/Button";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import CanAccess from "@/shared/components/permissions/CanAccess";
import { PERMISSIONS } from "@/shared/utils/permissions";

import { useRolesPaginated } from "../../hooks/roles/useRolesPaginated";
import { useState } from "react";

const RolesPages = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    items: roles,
    totalElements,
    isLoading,
    isFetching,
  } = useRolesPaginated(page - 1, pageSize);


  // const toggleActive = (roleId: string) => {
  //   setRoles((prev) =>
  //     prev.map((r: any) =>
  //       r.id === roleId ? { ...r, active: !r.active } : r
  //     )
  //   );
  // };

  const actions: TableAction<Role>[] = [
    {
      title: "Editar rol",
      label: "Editar",
      color: BUTTON_COLORS.BLUE,
      permission: PERMISSIONS.ADMIN.ROLES_EDIT,
      onClick: (role) => navigate(`/admin/roles/${role.id}`, {
        state: { role }
      }),
    },
    {
      title: "Inactivar rol",
      label: "Inactivar",
      color: BUTTON_COLORS.RED,
      permission: PERMISSIONS.ADMIN.INACTIVATE_ROLES,
      onClick: (role) => { },
    },
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
        <CanAccess permission={PERMISSIONS.ADMIN.ROLES_CREATE}>
          <Button
            label="Crear rol"
            icon={faUserLock}
            color="blue"
            onClick={() => navigate("/admin/roles/new")} />
        </CanAccess>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DataTable<Role>
          columns={[
            { key: "roleName", label: "Rol", sortable: true },
            { key: "actions", label: "Acciones", hasActions: true }]}
          data={roles}
          loading={isLoading || isFetching}
          actions={actions}
          page={page}
          pageSize={pageSize}
          total={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

    </div>
  );
};

export default RolesPages;