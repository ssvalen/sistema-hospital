import { useMemo, useState } from "react";
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

type Role = {
    id: string;
    name: string;
    description?: string;
};

type User = {
    id: string;
    name: string;
    roles: string[];
    active: boolean;
};

type UserForm = {
    id?: string;
    name: string;
    roles: string[];
};

const ROLES: Role[] = [
    {
        id: "admin",
        name: "Admin",
        description: "Acceso total al sistema"
    },
    {
        id: "doctor",
        name: "Doctor",
        description: "Gestión médica y consultas"
    },
    {
        id: "recepcion",
        name: "Recepción",
        description: "Atención y agenda"
    },
    {
        id: "enfermeria",
        name: "Enfermería",
        description: "Apoyo clínico y seguimiento"
    }
];

const UsersPage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [searchRole, setSearchRole] = useState("");

    const [users, setUsers] = useState<User[]>([
        {
            id: "1",
            name: "Juan Pérez",
            roles: ["admin"],
            active: true
        },
        {
            id: "2",
            name: "María López",
            roles: ["doctor", "enfermeria"],
            active: true
        },
        {
            id: "3",
            name: "Carlos Ruiz",
            roles: ["recepcion"],
            active: false
        }
    ]);

    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState<UserForm | null>(null);

    const openCreate = () => {
        setEditing({
            name: "",
            roles: []
        });

        setSearchRole("");
        setOpen(true);
    };

    const openEdit = (u: User) => {
        setEditing({
            id: u.id,
            name: u.name,
            roles: u.roles
        });

        setSearchRole("");
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setEditing(null);
        setSearchRole("");
    };

    const validate = () => {
        if (!editing) return false;

        if (!editing.name.trim()) {
            showToast(
                "El nombre es obligatorio",
                TOAST_TYPES.ERROR
            );

            return false;
        }

        if (editing.roles.length === 0) {
            showToast(
                "Debes seleccionar al menos un rol",
                TOAST_TYPES.ERROR
            );

            return false;
        }

        return true;
    };

    const save = () => {
        if (!editing) return;

        if (!validate()) return;

        const normalizedRoles = [...editing.roles].sort();

        const isSame =
            editing.id &&
            users.find(
                (u) =>
                    u.id === editing.id &&
                    u.name === editing.name &&
                    JSON.stringify([...u.roles].sort()) ===
                    JSON.stringify(normalizedRoles)
            );

        if (isSame) {
            showToast("Sin cambios", TOAST_TYPES.ERROR);
            return;
        }

        if (!editing.id) {
            setUsers((prev) => [
                {
                    id: crypto.randomUUID(),
                    name: editing.name,
                    roles: editing.roles,
                    active: true
                },
                ...prev
            ]);

            showToast(
                "Usuario creado",
                TOAST_TYPES.SUCCESS
            );
        } else {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === editing.id
                        ? {
                            ...u,
                            name: editing.name,
                            roles: editing.roles
                        }
                        : u
                )
            );

            showToast(
                "Usuario actualizado",
                TOAST_TYPES.SUCCESS
            );
        }

        close();
    };

    const toggleActive = (id: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id
                    ? {
                        ...u,
                        active: !u.active
                    }
                    : u
            )
        );

        showToast(
            "Estado actualizado",
            TOAST_TYPES.SUCCESS
        );
    };

    const toggleRole = (roleId: string) => {
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
    };

    const removeRole = (roleId: string) => {
        setEditing((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                roles: prev.roles.filter((r) => r !== roleId)
            };
        });
    };

    const getRole = (roleId: string) =>
        ROLES.find((r) => r.id === roleId);

    const filteredRoles = useMemo(() => {
        return ROLES.filter((r) =>
            `${r.name} ${r.description || ""}`
                .toLowerCase()
                .includes(searchRole.toLowerCase())
        );
    }, [searchRole]);

    const actions = useMemo(
        () => [
            {
                title: "Editar",
                label: "Editar",
                color: "blue",
                onClick: openEdit
            },
            {
                title: "Inactivar",
                label: "Inactivar",
                color: "red",
                onClick: (u: User) => toggleActive(u.id)
            }
        ],
        []
    );

    const columns = useMemo(
        () => [
            {
                key: "name",
                label: "Nombre"
            },
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
                                    {role.name}
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
                    <span
                        className={
                            row.active
                                ? "text-emerald-600"
                                : "text-red-500"
                        }
                    >
                        {row.active
                            ? "Activo"
                            : "Inactivo"}
                    </span>
                )
            },
            {
                key: "actions",
                label: "Acciones",
                hasActions: true
            }
        ],
        []
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
                        onPageChange={() => { }}
                    />
                </div>

                <Modal
                    abierto={open}
                    onClose={close}
                    titulo={
                        editing?.id
                            ? "Editar usuario"
                            : "Crear usuario"
                    }
                    size="md"
                >
                    <div className="space-y-5">
                        <FormField label="Nombre">
                            <Input
                                value={editing?.name || ""}
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                name: e.target.value
                                            }
                                            : prev
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Roles">
                            <div className="space-y-3">
                                <Input
                                    placeholder="Buscar roles..."
                                    value={searchRole}
                                    onChange={(e) =>
                                        setSearchRole(
                                            e.target.value
                                        )
                                    }
                                />

                                {editing &&
                                    editing.roles.length >
                                    0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {editing.roles.map(
                                                (roleId) => {
                                                    const role =
                                                        getRole(
                                                            roleId
                                                        );

                                                    if (!role)
                                                        return null;

                                                    return (
                                                        <div
                                                            key={role.id}
                                                            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:text-red-500"
                                                        >

                                                            <button
                                                                type="button"
                                                                onClick={() => removeRole(role.id ) }
                                                            >
                                                                <span>{role.name}</span>
                                                                <FontAwesomeIcon
                                                                    icon={faRemove}
                                                                    className="text-sm"
                                                                />
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}

                                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                                    {filteredRoles.map(
                                        (role) => {
                                            const selected =
                                                editing?.roles.includes(
                                                    role.id
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        role.id
                                                    }
                                                    onClick={() =>
                                                        toggleRole(
                                                            role.id
                                                        )
                                                    }
                                                    className={`w-full text-left px-4 py-3 transition border-b border-slate-100 last:border-b-0 ${selected
                                                        ? "bg-blue-50"
                                                        : "hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="font-medium text-slate-700">
                                                                {
                                                                    role.name
                                                                }
                                                            </div>

                                                            {role.description && (
                                                                <div className="text-xs text-slate-500 mt-1">
                                                                    {
                                                                        role.description
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>

                                                        {selected && (
                                                            <div className="text-blue-600 text-sm font-medium">
                                                                Seleccionado
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}

                                    {filteredRoles.length ===
                                        0 && (
                                            <div className="p-4 text-sm text-slate-400">
                                                No se encontraron
                                                roles
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

                            <Button
                                label="Guardar"
                                color="blue"
                                onClick={save}
                            />
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