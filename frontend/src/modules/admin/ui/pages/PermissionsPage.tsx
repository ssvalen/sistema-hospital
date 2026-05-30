import { useState } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import type { Permission } from "../../types/AuthTypes";
import type { TableAction } from "@/shared/types/table/TableTypes";
import { faKey } from "@fortawesome/free-solid-svg-icons";

import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";


type PermissionForm = {
  id?: string;
  name: string;
  code: string;
};

const PermissionsPage = () => {
  const { toast, showToast, hideToast } = useToast();

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "p1", name: "Ver pacientes", code: "patients.view" },
    { id: "p2", name: "Crear pacientes", code: "patients.create" },
    { id: "p3", name: "Editar pacientes", code: "patients.edit" },
  ]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PermissionForm | null>(null);

  const openCreate = () => {
    setEditing({ name: "", code: "" });
    setOpen(true);
  };

  const openEdit = (p: Permission) => {
    setEditing({ id: p.id, name: p.name, code: p.code });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const validate = () => {
    if (!editing) return false;

    if (!editing.name.trim()) {
      showToast("El nombre es obligatorio", TOAST_TYPES.ERROR);
      return false;
    }

    if (!editing.code.trim()) {
      showToast("El código es obligatorio", TOAST_TYPES.ERROR);
      return false;
    }

    return true;
  };

  const save = () => {
    if (!editing) return;
    if (!validate()) return;

    const isSame =
      editing.id &&
      permissions.find(
        (p) =>
          p.id === editing.id &&
          p.name === editing.name &&
          p.code === editing.code
      );

    if (isSame) {
      showToast("Sin cambios", TOAST_TYPES.ERROR);
      return;
    }

    if (!editing.id) {
      setPermissions((prev) => [
        {
          id: crypto.randomUUID(),
          name: editing.name,
          code: editing.code,
        },
        ...prev,
      ]);

      showToast("Permiso creado", TOAST_TYPES.SUCCESS);
    } else {
      setPermissions((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, name: editing.name, code: editing.code }
            : p
        )
      );

      showToast("Permiso actualizado", TOAST_TYPES.SUCCESS);
    }

    close();
  };

  const toggleInactive = (id: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id));
    showToast("Permiso eliminado", TOAST_TYPES.SUCCESS);
  };

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
      onClick: (p) => toggleInactive(p.id),
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

      <DataTable
        columns={[
          { key: "name", label: "Permiso" },
          { key: "code", label: "Código" },
          { key: "actions", label: "Acciones", hasActions: true },
        ]}
        data={permissions}
        actions={actions}
        page={1}
        pageSize={10}
        total={permissions.length}
        onPageChange={() => {}}
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

          <FormField label="Código">
            <Input
              value={editing?.code || ""}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, code: e.target.value } : prev
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

            <Button label="Guardar" color="blue" onClick={save} />
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