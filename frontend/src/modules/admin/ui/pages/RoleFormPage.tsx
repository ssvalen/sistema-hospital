import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import Checkbox from "@/shared/components/forms/Checkbox";

import type { Permission, Role } from "../../types/AuthTypes";

interface LocationState {
  role?: Role;
  permissions?: Permission[];
}

type Errors = {
  name?: string;
  description?: string;
  permissions?: string;
};

const RoleFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast, showToast, hideToast } = useToast();

  const state = location.state as LocationState | null;

  const permissions = state?.permissions ?? [];
  const initialRole = state?.role ?? null;

  const isEditMode = Boolean(initialRole);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (initialRole) {
      setName(initialRole.name);
      setDescription(initialRole.description || "");
      setSelectedPermissions(initialRole.permissions || []);
    } else {
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    }
  }, [initialRole]);

  const initialSnapshot = useMemo(() => {
    return {
      name: initialRole?.name ?? "",
      description: initialRole?.description ?? "",
      permissions: initialRole?.permissions ?? [],
    };
  }, [initialRole]);

  const samePermissions = (a: Permission[], b: Permission[]) => {
    if (a.length !== b.length) return false;

    const aIds = a.map(p => p.id).sort();
    const bIds = b.map(p => p.id).sort();

    return aIds.every((id, index) => id === bIds[index]);
  };

  const hasChanges = () => {
    return (
      name !== initialSnapshot.name ||
      description !== initialSnapshot.description ||
      !samePermissions(selectedPermissions, initialSnapshot.permissions)
    );
  };

  const filteredPermissions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return permissions;

    return permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.code ?? "").toLowerCase().includes(q)
    );
  }, [permissions, search]);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      const exists = prev.some((p) => p.id === permission.id);
      return exists
        ? prev.filter((p) => p.id !== permission.id)
        : [...prev, permission];
    });
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria";
    if (selectedPermissions.length === 0)
      newErrors.permissions = "Debes seleccionar al menos un permiso";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Revisa los campos del formulario", TOAST_TYPES.ERROR);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode && !hasChanges()) {
      showToast("No hay cambios para guardar", TOAST_TYPES.ERROR);
      return;
    }

    showToast(
      isEditMode ? "Rol actualizado" : "Rol creado",
      TOAST_TYPES.SUCCESS
    );

    setTimeout(() => navigate("/admin/roles"), 500);
  };

  const handleCancel = () => {
    navigate("/admin/roles");
  };

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
                <input
                  value={name}
                  disabled={isEditMode}
                  onChange={(e) => setName(e.target.value)}
                  className={
                    isEditMode
                      ? "w-full h-12 px-4 rounded-2xl border bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                      : "w-full h-12 px-4 rounded-2xl border bg-slate-50 border-slate-200 text-slate-700"
                  }
                  placeholder="Ej: Administrador"
                />
              </FormField>

              <FormField label="Descripción" error={errors.description}>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl border bg-slate-50 border-slate-200 text-slate-700"
                  placeholder="Descripción del rol"
                />
              </FormField>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 overflow-hidden">

              <div className="p-5 lg:p-6 border-b border-slate-200 bg-white/70">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">

                  <h2 className="text-lg font-semibold">Permisos</h2>

                  <div className="w-full lg:w-[320px]">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl border bg-slate-50 border-slate-200 text-slate-700"
                      placeholder="Buscar permisos..."
                    />
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
                  <p className="text-sm text-slate-500">Sin permisos</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

                    {filteredPermissions.map((p) => {
                      const checked = selectedPermissions.some(
                        (sp) => sp.id === p.id
                      );

                      return (
                        <Checkbox
                          key={p.id}
                          checked={checked}
                          onChange={() => togglePermission(p)}
                          label={
                            <div>
                              <p className="text-sm">{p.name}</p>
                              <p className="text-xs text-slate-400">
                                {p.code}
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