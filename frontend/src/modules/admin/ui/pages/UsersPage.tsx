import { useMemo, useState, useCallback } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { faRemove, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAllRoles } from "@/modules/admin/hooks/roles/useGetAllRoles";
import type { Role } from "@/modules/admin/domain/entities/Role";

type User = {
    id: string;
    name: string;
    roles: number[];
    active: boolean;
};

type UserForm = {
    id?: string;
    name: string;
    email: string;
    password: string;
    roles: number[];
};

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
    roles?: string;
};

const initialUsers: User[] = [
    { id: "1", name: "Juan Pérez", roles: [1], active: true },
    { id: "2", name: "María López", roles: [2], active: true },
    { id: "3", name: "Carlos Ruiz", roles: [3], active: false }
];

const initialForm: UserForm = {
    name: "",
    email: "",
    password: "",
    roles: []
};

const UsersPage = () => {
    const { toast, showToast, hideToast } = useToast();
    const { data: roles = [] } = useGetAllRoles();

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UserForm | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [searchRole, setSearchRole] = useState("");

    const openCreate = useCallback(() => {
        setEditing(initialForm);
        setErrors({});
        setSearchRole("");
        setOpen(true);
    }, []);

    const openEdit = useCallback((u: User) => {
        setEditing({
            id: u.id,
            name: u.name,
            email: "",
            password: "",
            roles: u.roles
        });
        setErrors({});
        setSearchRole("");
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        setEditing(null);
        setErrors({});
        setSearchRole("");
    }, []);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validate = useCallback(() => {
        if (!editing) return false;

        const newErrors: FormErrors = {};
        const name = editing.name.trim();

        if (name.length < 3 || name.length > 20) {
            newErrors.name = "Debe tener entre 3 y 20 caracteres";
        }

        if (!editing.email.trim() || !isValidEmail(editing.email)) {
            newErrors.email = "Correo electrónico inválido";
        }

        if (!editing.id && editing.password.trim().length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        if (editing.roles.length === 0) {
            newErrors.roles = "Selecciona al menos un rol";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }, [editing]);

    const save = useCallback(() => {
        if (!editing || !validate()) return;

        const normalizedRoles = [...editing.roles].sort((a, b) => a - b);

        if (editing.id) {
            const existing = users.find((u) => u.id === editing.id);

            if (
                existing &&
                existing.name === editing.name.trim() &&
                JSON.stringify([...existing.roles].sort((a, b) => a - b)) ===
                    JSON.stringify(normalizedRoles)
            ) {
                showToast("Sin cambios", TOAST_TYPES.ERROR);
                return;
            }

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === editing.id
                        ? { ...u, name: editing.name.trim(), roles: normalizedRoles }
                        : u
                )
            );

            showToast("Usuario actualizado", TOAST_TYPES.SUCCESS);
        } else {
            setUsers((prev) => [
                {
                    id: crypto.randomUUID(),
                    name: editing.name.trim(),
                    roles: normalizedRoles,
                    active: true
                },
                ...prev
            ]);

            showToast("Usuario creado", TOAST_TYPES.SUCCESS);
        }

        close();
    }, [editing, users, validate, showToast, close]);

    const toggleActive = useCallback((id: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, active: !u.active } : u
            )
        );
        showToast("Estado actualizado", TOAST_TYPES.SUCCESS);
    }, [showToast]);

    const toggleRole = useCallback((roleId: number) => {
        setEditing((prev) => {
            if (!prev) return prev;
            const exists = prev.roles.includes(roleId);
            return {
                ...prev,
                roles: exists
                    ? prev.roles.filter((r) => r !== roleId)
                    : [...prev.roles, roleId]
            };
        });

        setErrors((prev) => ({ ...prev, roles: undefined }));
    }, []);

    const removeRole = useCallback((roleId: number) => {
        setEditing((prev) =>
            prev ? { ...prev, roles: prev.roles.filter((r) => r !== roleId) } : prev
        );
    }, []);

    const getRole = useCallback(
        (roleId: number) => roles.find((r: Role) => r.id === roleId),
        [roles]
    );

    const filteredRoles = useMemo(
        () =>
            roles.filter((r: Role) =>
                r.roleName.toLowerCase().includes(searchRole.toLowerCase())
            ),
        [roles, searchRole]
    );

    const actions = useMemo(
        () => [
            { title: "Editar", label: "Editar", color: "blue", onClick: openEdit },
            {
                title: "Inactivar",
                label: "Inactivar",
                color: "red",
                onClick: (u: User) => toggleActive(u.id)
            }
        ],
        [openEdit, toggleActive]
    );

    const columns = useMemo(
        () => [
            { key: "name", label: "Nombre" },
            {
                key: "roles",
                label: "Roles",
                render: (row: User) => (
                    <div className="flex flex-wrap gap-2">
                        {row.roles.map((roleId) => {
                            const role = getRole(roleId);
                            if (!role) return null;
                            return (
                                <span
                                    key={role.id}
                                    className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                                >
                                    {role.roleName}
                                </span>
                            );
                        })}
                    </div>
                )
            },
            {
                key: "active",
                label: "Estado",
                render: (row: User) => (
                    <span className={row.active ? "text-emerald-600" : "text-red-500"}>
                        {row.active ? "Activo" : "Inactivo"}
                    </span>
                )
            },
            { key: "actions", label: "Acciones", hasActions: true }
        ],
        [getRole]
    );

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Usuarios
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestión de usuarios del sistema
                        </p>
                    </div>

                    <Button
                        icon={faUserPlus}
                        label="Crear usuario"
                        color="blue"
                        onClick={openCreate}
                    />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={users}
                        actions={actions as any}
                        page={1}
                        pageSize={10}
                        total={users.length}
                        onPageChange={() => {}}
                    />
                </div>

                <Modal
                    abierto={open}
                    onClose={close}
                    titulo={editing?.id ? "Editar usuario" : "Crear usuario"}
                    size="md"
                >
                    <div className="space-y-5">
                        <FormField label="Nombre" error={errors.name}>
                            <Input
                                value={editing?.name || ""}
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev ? { ...prev, name: e.target.value } : prev
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Correo" error={errors.email}>
                            <Input
                                value={editing?.email || ""}
                                type="email"
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev ? { ...prev, email: e.target.value } : prev
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Contraseña por defecto" error={errors.password}>
                            <Input
                                value={editing?.password || ""}
                                type="password"
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev ? { ...prev, password: e.target.value } : prev
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Roles" error={errors.roles}>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Buscar roles..."
                                    value={searchRole}
                                    onChange={(e) => setSearchRole(e.target.value)}
                                />

                                {editing && editing.roles.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {editing.roles.map((roleId) => {
                                            const role = getRole(roleId);
                                            if (!role) return null;

                                            return (
                                                <div
                                                    key={role.id}
                                                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRole(role.id)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span>{role.roleName}</span>
                                                        <FontAwesomeIcon icon={faRemove} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto">
                                    {filteredRoles.map((role) => {
                                        const selected = editing?.roles.includes(role.id);

                                        return (
                                            <button
                                                type="button"
                                                key={role.id}
                                                onClick={() => toggleRole(role.id)}
                                                className={`w-full text-left px-4 py-3 border-b border-slate-100 ${
                                                    selected ? "bg-blue-50" : "hover:bg-slate-50"
                                                }`}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="font-medium text-slate-700">
                                                        {role.roleName}
                                                    </div>
                                                    {selected && (
                                                        <div className="text-blue-600 text-sm">
                                                            Seleccionado
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}

                                    {filteredRoles.length === 0 && (
                                        <div className="p-4 text-sm text-slate-400">
                                            No se encontraron roles
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormField>

                        <div className="flex justify-end gap-3 pt-2">
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

export default UsersPage;