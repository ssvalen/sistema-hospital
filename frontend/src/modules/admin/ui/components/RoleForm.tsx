import React, { useEffect, useState } from "react";
import type { Role, Permission } from "../../types/AuthTypes";

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

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

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

    const togglePermission = (permission: Permission) => {
        setSelectedPermissions(prev => {
            const exists = prev.some(p => p.id === permission.id);
            return exists
                ? prev.filter(p => p.id !== permission.id)
                : [...prev, permission];
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Role | Omit<Role, "id"> = isEditMode
            ? {
                ...(initialRole as Role),
                name,
                description,
                permissions: selectedPermissions,
            }
            : {
                name,
                description,
                permissions: selectedPermissions,
            };

        onSubmit(payload);
    };

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl">

            <h2 className="text-xl font-bold mb-4">
                {isEditMode ? "Editar Rol" : "Crear Rol"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre"
                    className="w-full border p-2 rounded"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción"
                    className="w-full border p-2 rounded"
                />

                <div className="border p-2 rounded max-h-60 overflow-auto">
                    {permissions.map(p => (
                        <label key={p.id} className="flex gap-2">
                            <input
                                type="checkbox"
                                checked={selectedPermissions.some(sp => sp.id === p.id)}
                                onChange={() => togglePermission(p)}
                            />
                            {p.name}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onCancel}>
                        Cancelar
                    </button>

                    <button type="submit">
                        {isEditMode ? "Actualizar" : "Crear"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default RoleForm;