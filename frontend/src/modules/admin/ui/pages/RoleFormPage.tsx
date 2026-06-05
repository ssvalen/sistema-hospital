import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Checkbox from "@/shared/components/forms/Checkbox";
import Select from "@/shared/components/forms/Select";
import Input from "@/shared/components/forms/Input";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { TOAST_CONFIG } from "@/shared/types/ToastConfig";

import type { Role } from "@/modules/admin/domain/entities/Role";
import type { Permission } from "@/modules/admin/domain/entities/Permission";
import type { ParentRole } from "@/modules/admin/domain/entities/ParentRole";

import { useGetAllPermissions } from "@/modules/admin/hooks/permissions/useGetAllPermissions";
import { useGetRolePermissions } from "@/modules/admin/hooks/permissions/useGetRolePermissions";
import { useParentRoles } from "../../hooks/roles/useParentRoles";
import { usePutRole } from "../../hooks/roles/usePutRole";

import type { CreateRoleParams } from "../../types/AdminTypes";
import { useRoleById } from "../../hooks/roles/useRoleById";

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

  const roleId: number = Number(initialRole?.id)


  const { data: roleData, isLoading: rolePermissionsLoading } = useRoleById(roleId || 0, { enabled: isEditMode, });
  const { data: parentRolesData = [] } = useParentRoles(true);
  const { data: permissions = [], isLoading: permissionsLoading } = useGetAllPermissions();


  const [name, setName] = useState("");
  const [parentRole, setParentRole] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [errors, setErrors] = useState<Errors>({});


  useEffect(() => {
    if (!initialRole) {
      setName("");
      setParentRole("");
      setSelectedPermissions([]);
      return;
    }

    setName(initialRole.roleName ?? "");
  }, [initialRole]);

  useEffect(() => {
    if (
      !isEditMode ||
      !initialRole ||
      !parentRolesData.length
    ) {
      return;
    }

    const parentRoleFound = parentRolesData.find(
      (role: ParentRole) =>
        role.id === initialRole.parentRole?.id
    );

    if (parentRoleFound) {
      setParentRole(String(parentRoleFound.id));
    }
  }, [
    isEditMode,
    initialRole,
    parentRolesData,
  ]);




  useEffect(() => {
    if (!isEditMode || !roleData) return;

    setSelectedPermissions(
      roleData.permissions.map((p) => p.id)
    );
  }, [roleData, isEditMode]);

  const initialSnapshot = useMemo(() => {
    return {
      name: initialRole?.roleName ?? "",
      parentRole:
        initialRole?.parentRole?.id
          ? String(initialRole.parentRole.id)
          : "",
      permissions:
        roleData?.permissions?.map(
          (p) => p.id
        ) ?? [],
    };
  }, [initialRole, roleData]);

  const samePermissions = (
    first: number[],
    second: number[]
  ) => {
    if (first.length !== second.length) {
      return false;
    }

    const sortedFirst = [...first].sort(
      (a, b) => a - b
    );

    const sortedSecond = [...second].sort(
      (a, b) => a - b
    );

    return sortedFirst.every(
      (value, index) =>
        value === sortedSecond[index]
    );
  };

  const hasChanges = () => {
    return (
      name !== initialSnapshot.name ||
      parentRole !== initialSnapshot.parentRole ||
      !samePermissions(
        selectedPermissions,
        initialSnapshot.permissions
      )
    );
  };

  const filteredPermissions = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return permissions;
    }

    return permissions.filter(
      (permission: Permission) =>
        permission.permissionName
          .toLowerCase()
          .includes(query)
    );
  }, [permissions, search]);

  const togglePermission = (
    permission: Permission
  ) => {
    setSelectedPermissions((previous) => {
      const exists = previous.includes(
        permission.id
      );

      return exists
        ? previous.filter(
          (id) => id !== permission.id
        )
        : [...previous, permission.id];
    });
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name =
        "El nombre es obligatorio";
    }

    if (!parentRole) {
      newErrors.parentRole =
        "Debes seleccionar un rol modelo";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast(
        "Revisa los campos del formulario",
        TOAST_TYPES.ERROR
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditMode && !hasChanges()) {
      showToast(
        "No hay cambios para guardar",
        TOAST_TYPES.ERROR
      );

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
        isEditMode
          ? "Rol actualizado"
          : "Rol creado",
        TOAST_TYPES.SUCCESS
      );

      setTimeout(
        () => navigate(-1),
        TOAST_CONFIG.success.duration
      );
    } catch {
      showToast(
        `Error al ${isEditMode ? "editar" : "crear"
        } rol`,
        TOAST_TYPES.ERROR
      );
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isLoading =
    permissionsLoading ||
    (isEditMode &&
      rolePermissionsLoading);

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
              {isEditMode
                ? "Editar rol"
                : "Crear rol"}
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 lg:p-8 space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <FormField
                label="Nombre del rol"
                error={errors.name}
              >
                <Input
                  value={name}
                  disabled={isEditMode}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Ingrese el nombre del rol"
                />
              </FormField>

              <FormField
                label="Rol modelo"
                error={errors.parentRole}
              >
                <Select
                  value={parentRole}
                  onChange={(e) =>
                    setParentRole(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Seleccionar
                  </option>

                  {parentRolesData.map(
                    (
                      role: ParentRole
                    ) => (
                      <option
                        key={role.id}
                        value={String(
                          role.id
                        )}
                      >
                        {role.name}
                      </option>
                    )
                  )}
                </Select>
              </FormField>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 overflow-hidden">
              <div className="p-5 lg:p-6 border-b border-slate-200 bg-white/70">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                  <h2 className="text-lg font-semibold">
                    Permisos
                  </h2>

                  <div className="w-full lg:w-[320px]">
                    <FormField label="Buscar permiso">
                      <Input
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
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
                {filteredPermissions.length ===
                  0 ? (
                  <p className="text-sm text-slate-500 text-center">
                    No se han encontrado
                    permisos
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredPermissions.map(
                      (
                        permission: Permission
                      ) => (
                        <Checkbox
                          key={
                            permission.id
                          }
                          checked={selectedPermissions.includes(
                            permission.id
                          )}
                          onChange={() =>
                            togglePermission(
                              permission
                            )
                          }
                          label={
                            <div>
                              <p className="text-sm">
                                {
                                  permission.permissionName
                                }
                              </p>
                            </div>
                          }
                        />
                      )
                    )}
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
                label={
                  isEditMode
                    ? "Actualizar"
                    : "Crear"
                }
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