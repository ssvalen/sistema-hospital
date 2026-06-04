import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Checkbox from "@/shared/components/forms/Checkbox";
import Select from "@/shared/components/forms/Select";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import type { Role } from "@/modules/admin/domain/entities/Role";
import type { Permission } from "@/modules/admin/domain/entities/Permission";

import { useGetAllPermissions } from "@/modules/admin/hooks/permissions/useGetAllPermissions";
import { useGetRolePermissions } from "@/modules/admin/hooks/permissions/useGetRolePermissions";
import { useParentRoles } from "../../hooks/roles/useParentRoles";
import { usePutRole } from "../../hooks/roles/usePutRole";

import Input from "@/shared/components/forms/Input";
import { TOAST_CONFIG } from "@/shared/types/ToastConfig";
import type { CreateRoleParams } from "../../types/AdminTypes";

interface LocationState {
  role?: Role;
}

type Errors = {
  name?: string;
  permissions?: string;
  parentRole?: string;
};

const RoleFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast, showToast, hideToast } = useToast();
  const putRoleMutation = usePutRole();

  const state = location.state as LocationState | null;
  const initialRole = state?.role ?? null;
  const isEditMode = Boolean(initialRole);

  const {
    data: permissions = [],
    isLoading: permissionsLoading,
  } = useGetAllPermissions();

  const {
    data: rolePermissions = [],
    isLoading: rolePermissionsLoading,
  } = useGetRolePermissions(initialRole?.id ?? 0, {
    enabled: isEditMode,
  });

  const { data: parentRolesData } = useParentRoles(true);

  const [name, setName] = useState("");
  const [parentRole, setParentRole] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!initialRole) {
      setName("");
      setSelectedPermissions([]);
      return;
    }

    setName(initialRole.roleName ?? "");
  }, [initialRole]);

  useEffect(() => {
    if (!isEditMode) return;
    if (!rolePermissions.length) return;

    setSelectedPermissions(rolePermissions.map((p: Permission) => p.id));
  }, [rolePermissions, isEditMode]);

  const initialSnapshot = useMemo(() => {
    return {
      name: initialRole?.roleName ?? "",
      permissions: rolePermissions.map((p: Permission) => p.id),
    };
  }, [initialRole, rolePermissions]);

  const samePermissions = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x - y);
    const bSorted = [...b].sort((x, y) => x - y);

    return aSorted.every((value, index) => value === bSorted[index]);
  };

  const hasChanges = () => {
    return (
      name !== initialSnapshot.name ||
      !samePermissions(selectedPermissions, initialSnapshot.permissions)
    );
  };

  const filteredPermissions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return permissions;

    return permissions.filter((p: Permission) =>
      p.permissionName.toLowerCase().includes(q)
    );
  }, [permissions, search]);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      const exists = prev.includes(permission.id);

      return exists
        ? prev.filter((p) => p !== permission.id)
        : [...prev, permission.id];
    });
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = "Debes seleccionar al menos un permiso";
    }

    if (!parentRole) {
      newErrors.parentRole = "Debes seleccionar un rol modelo";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Revisa los campos del formulario", TOAST_TYPES.ERROR);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode && !hasChanges()) {
      showToast("No hay cambios para guardar", TOAST_TYPES.ERROR);
      return;
    }

    const payload: CreateRoleParams = {
      roleId: initialRole?.id ?? 0,
      roleName: name,
      parentRoleId: Number(parentRole),
      permissions: selectedPermissions,
    };

    try {

      await putRoleMutation.mutateAsync({
        edit: isEditMode,
        params: payload,
      });

      showToast(
        isEditMode ? "Rol actualizado" : "Rol creado",
        TOAST_TYPES.SUCCESS
      );

      setTimeout(() => navigate(-1), TOAST_CONFIG.success.duration);
    } catch {
      showToast(
        `Error al ${isEditMode ? "editar" : "crear"} rol`,
        TOAST_TYPES.ERROR
      );
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isLoading =
    permissionsLoading || (isEditMode && rolePermissionsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 lg:px-8 py-6 border-b border-slate-100">
            <h1 className="text-2xl font-semibold text-slate-800">
              {isEditMode ? "Editar rol" : "Crear rol"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <FormField label="Nombre del rol" error={errors.name}>
                <Input
                  value={name}
                  disabled={isEditMode}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingrese el nombre del rol"
                />
              </FormField>

              <FormField label="Rol modelo" error={errors.parentRole}>
                <Select
                  value={parentRole}
                  onChange={(e) => setParentRole(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>

                  {parentRolesData?.map((parentRole) => (
                    <option key={parentRole.id} value={parentRole.id}>
                      {parentRole.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="p-5 lg:p-6 border-b border-slate-200 bg-white/70">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                  <h2 className="text-lg font-semibold">Permisos</h2>

                  <div className="w-full lg:w-[320px]">
                    <FormField label="Buscar permiso">
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar permisos..."
                      />
                    </FormField>
                  </div>
                </div>

                {errors.permissions && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.permissions}
                  </p>
                )}
              </div>

              <div className="p-5 lg:p-6 max-h-[520px] overflow-auto">
                {filteredPermissions.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center">
                    No se han encontrado permisos
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredPermissions.map((permission: Permission) => {
                      const checked = selectedPermissions.includes(
                        permission.id
                      );

                      return (
                        <Checkbox
                          key={permission.id}
                          checked={checked}
                          onChange={() => togglePermission(permission)}
                          label={
                            <div>
                              <p className="text-sm">
                                {permission.permissionName}
                              </p>
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                label="Cancelar"
                color="gray"
                variant="outline"
                onClick={handleCancel}
              />

              <Button
                type="submit"
                label={isEditMode ? "Actualizar" : "Crear"}
                color="blue"
              />
            </div>
          </form>
        </div>
      </div>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
};

export default RoleFormPage;