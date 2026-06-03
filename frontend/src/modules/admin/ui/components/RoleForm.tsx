import React, { useEffect, useState } from "react";
import type { Role } from "@/modules/admin/domain/entities/Role";
import type { Permission } from "@/modules/admin/domain/entities/Permission";

import Input from "@/shared/components/forms/Input";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Fieldset from "@/shared/components/forms/Fieldset";
import Checkbox from "@/shared/components/forms/Checkbox";

interface Props {
  initialRole?: Role | null;
  permissions: Permission[];
  onSubmit: (role: Role | Omit<Role, "id">) => void;
  onCancel: () => void;
}

const RoleForm = ({
  initialRole,
  permissions,
  onSubmit,
  onCancel,
}: Props) => {

  const isEditMode = Boolean(initialRole);

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (initialRole) {
      setRoleName(initialRole.roleName);
      setSelectedPermissions(initialRole.permissions || []);
    } else {
      setRoleName("");
      setSelectedPermissions([]);
    }
  }, [initialRole]);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions(prev => {
      const exists = prev.includes(permission.permissionName);

      return exists
        ? prev.filter(p => p !== permission.permissionName)
        : [...prev, permission.permissionName];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Role | Omit<Role, "id"> = isEditMode
      ? {
          ...(initialRole as Role),
          roleName,
          permissions: selectedPermissions,
        }
      : {
          roleName,
          permissions: selectedPermissions,
        };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* NOMBRE */}
      <Fieldset
        title={isEditMode ? "Editar rol" : "Crear rol"}
        description="Define el nombre del rol y sus permisos"
      >
        <FormField label="Nombre del rol">

          <Input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Ej: Administrador"
          />

        </FormField>
      </Fieldset>

      {/* PERMISOS */}
      <Fieldset
        title="Permisos"
        description="Selecciona los permisos que tendrá este rol"
      >
        <div className="space-y-2 max-h-64 overflow-auto pr-1">

          {permissions.map((p) => (
            <Checkbox
              key={p.id}
              checked={selectedPermissions.includes(p.permissionName)}
              onChange={() => togglePermission(p)}
              label={
                <span className="text-sm font-medium text-slate-700">
                  {p.permissionName}
                </span>
              }
            />
          ))}

        </div>
      </Fieldset>

      {/* ACCIONES */}
      <div className="flex justify-end gap-2 pt-2">

        <Button
          type="button"
          label="Cancelar"
          color={BUTTON_COLORS.GRAY}
          variant="outline"
          onClick={onCancel}
        />

        <Button
          type="submit"
          label={isEditMode ? "Actualizar rol" : "Crear rol"}
          color={BUTTON_COLORS.BLUE}
        />

      </div>

    </form>
  );
};

export default RoleForm;