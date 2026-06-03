import { useState } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import type { Permission } from "@/modules/admin/domain/entities/Permission";
import type { TableAction } from "@/shared/types/table/TableTypes";

import { faKey } from "@fortawesome/free-solid-svg-icons";
import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";

import { useGetPermissionsPaginated } from "../../hooks/permissions/useGetPermissionsPaginated";
import { useCreatePermission } from "../../hooks/permissions/useCreatePermission";
import { useUpdatePermission } from "../../hooks/permissions/useUpdatePermission";
// import { useInactivatePermission } from "../../hooks/useInactivatePermission";

type PermissionForm = {
  id?: number;
  name: string;
};

const PermissionsPage = () => {
  const { toast, showToast, hideToast } = useToast();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    items: permissions,
    totalElements,
    isLoading,
    isFetching,
  } = useGetPermissionsPaginated(page - 1, pageSize);

  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();
  // const inactivatePermission = useInactivatePermission();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PermissionForm | null>(null);

  const openCreate = () => {
    setEditing({ name: "" });
    setOpen(true);
  };

  const openEdit = (p: Permission) => {
    setEditing({
      id: p.id,
      name: p.permissionName,
    });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const validate = () => {
    if (!editing?.name.trim()) {
      showToast("El nombre es obligatorio", TOAST_TYPES.ERROR);
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!editing || !validate()) return;

    if (!editing.id) {
      createPermission.mutate(editing.name, {
        onSuccess: () => {
          showToast("Permiso creado", TOAST_TYPES.SUCCESS);
          close();
        },
        onError: () => {
          showToast("Error al crear permiso", TOAST_TYPES.ERROR);
        },
      });
    } else {
      updatePermission.mutate(
        { id: editing.id, name: editing.name },
        {
          onSuccess: () => {
            showToast("Permiso actualizado", TOAST_TYPES.SUCCESS);
            close();
          },
          onError: () => {
            showToast("Error al actualizar permiso", TOAST_TYPES.ERROR);
          },
        }
      );
    }
  };

  // const toggleInactive = (id: number) => {
  //   inactivatePermission.mutate(id, {
  //     onSuccess: () => {
  //       showToast("Permiso inactivado", TOAST_TYPES.SUCCESS);
  //     },
  //     onError: () => {
  //       showToast("Error al inactivar permiso", TOAST_TYPES.ERROR);
  //     },
  //   });
  // };

  const actions: TableAction<Permission>[] = [
    {
      title: "Editar",
      label: "Editar",
      color: BUTTON_COLORS.BLUE,
      permission: PERMISSIONS.ADMIN.PERMISSIONS_EDIT,
      onClick: openEdit,
    },
    {
      title: "Inactivar",
      label: "Inactivar",
      color: BUTTON_COLORS.RED,
      permission: PERMISSIONS.ADMIN.PERMISSIONS_INACTIVATE,
      onClick: (p) => { },
      // onClick: (p) => toggleInactive(p.id),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 isolate p-6 lg:p-8 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Permisos</h1>
          <p className="text-sm text-slate-500">Gestión de permisos</p>
        </div>

        <CanAccess permission={PERMISSIONS.ADMIN.PERMISSIONS_CREATE}>
          <Button
            icon={faKey}
            label="Crear permiso"
            color="blue"
            onClick={openCreate}
          />
        </CanAccess>
      </div>

      <DataTable<Permission>
        columns={[
          { key: "permissionName", label: "Permiso" },
          { key: "actions", label: "Acciones", hasActions: true },
        ]}
        loading={isLoading || isFetching}
        data={permissions}
        page={page}
        pageSize={pageSize}
        total={totalElements}
        onPageChange={setPage}
        actions={actions}
      />

      <Modal
        abierto={open}
        onClose={close}
        titulo={editing?.id ? "Editar permiso" : "Crear permiso"}
        size="md"
      >
        <div className="space-y-4">

          <FormField label="Nombre">
            <Input
              value={editing?.name || ""}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              label="Cancelar"
              color="gray"
              variant="outline"
              onClick={close}
            />

            <Button
              label="Guardar"
              color="blue"
              onClick={save}
              disabled={
                createPermission.isPending ||
                updatePermission.isPending
              }
            />
          </div>

        </div>
      </Modal>

      <div className="fixed top-4 right-4 z-[9999]">
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      </div>

    </div>
  );
};

export default PermissionsPage;