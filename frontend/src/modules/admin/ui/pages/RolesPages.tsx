import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/shared/components/DataTable";
import ConfirmationModal from "@/shared/components/ConfirmationModal";
import Button from "@/shared/components/forms/Button";
import CanAccess from "@/shared/components/permissions/CanAccess";

import type { Role } from "@/modules/admin/domain/entities/Role";
import type { TableAction } from "@/shared/types/table/TableTypes";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { TOAST_CONFIG } from "@/shared/types/ToastConfig";


import { BUTTON_COLORS } from "@/shared/types/button/ButtonTypes";
import { PERMISSIONS } from "@/shared/utils/permissions";

import {
  faPen,
  faTrash,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";

import { useRolesPaginated } from "../../hooks/roles/useRolesPaginated";
import { useRemoveRole } from "../../hooks/roles/useRemoveRole";
import { HttpError } from "@/shared/errors/HttpError";

const RolesPages = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const {
    items: roles,
    totalElements,
    isLoading,
    isFetching,
  } = useRolesPaginated(page - 1, pageSize);

  const removeRole = useRemoveRole()


  const openModal = (role: Role) => {
    setSelectedRole(role);
    setOpen(true);
  };

  const onCancel = () => {
    setOpen(false);
    setSelectedRole(null);
  };

  const onConfirm = async () => {
    if (!selectedRole) return;

    try {
      await removeRole.mutateAsync(selectedRole.id)
      showToast("Rol eliminado exitosamente", TOAST_TYPES.SUCCESS)
    } catch (error) {
      if (error instanceof HttpError) {
        showToast(`${error.message}`, TOAST_TYPES.ERROR)

      } else {
        showToast('Ha ocurrido un error al eliminar el rol.', TOAST_TYPES.ERROR)
      }
    } finally {
      setOpen(false);
      setSelectedRole(null);
    }

  };

  const actions: TableAction<Role>[] = [
    {
      title: "Editar rol",
      label: "Editar",
      color: BUTTON_COLORS.BLUE,
      icon: faPen,
      permission: PERMISSIONS.ADMIN.ROLES_EDIT,
      onClick: (role) =>
        navigate(`/admin/roles/${role.id}`, {
          state: { role },
        }),
    },
    {
      title: "Eliminar rol",
      label: "Eliminar",
      icon: faTrash,
      color: BUTTON_COLORS.RED,
      permission: PERMISSIONS.ADMIN.INACTIVATE_ROLES,
      onClick: openModal,
    },
  ];

  return (
    <>
      <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Roles
            </h1>

            <p className="text-sm text-slate-500">
              Administración de roles del sistema
            </p>
          </div>

          <CanAccess permission={PERMISSIONS.ADMIN.ROLES_CREATE}>
            <Button
              label="Crear rol"
              icon={faUserLock}
              color="blue"
              onClick={() => navigate("/admin/roles/new")}
            />
          </CanAccess>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable<Role>
            columns={[
              {
                key: "roleName",
                label: "Rol",
                sortable: true,
              },
              {
                key: "actions",
                label: "Acciones",
                hasActions: true,
              },
            ]}
            data={roles}
            loading={isLoading || isFetching}
            actions={actions}
            page={page}
            pageSize={pageSize}
            total={totalElements}
            onPageChange={setPage}
          />
        </div>

        <ConfirmationModal
          open={open}
          title="Inactivar rol"
          message={`¿Estás seguro de que deseas inactivar el rol "${selectedRole?.roleName ?? ""}"?`}
          confirmText="Inactivar"
          cancelText="Cancelar"
          confirmColor="red"
          icon={faTrash}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
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

export default RolesPages;