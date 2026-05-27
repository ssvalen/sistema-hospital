import { useMemo, useState } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

type User = {
    id: string;
    name: string;
    role: string;
    active: boolean;
};

type UserForm = {
    id?: string;
    name: string;
    role: string;
};

const ROLES = ["Admin", "Doctor", "Recepción", "Enfermería"];

const UsersPage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [users, setUsers] = useState<User[]>([
        { id: "1", name: "Juan Pérez", role: "Admin", active: true },
        { id: "2", name: "María López", role: "Doctor", active: true },
        { id: "3", name: "Carlos Ruiz", role: "Recepción", active: false }
    ]);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UserForm | null>(null);

    const openCreate = () => {
        setEditing({ name: "", role: "" });
        setOpen(true);
    };

    const openEdit = (u: User) => {
        setEditing({ id: u.id, name: u.name, role: u.role });
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

        if (!editing.role.trim()) {
            showToast("Debes seleccionar un rol", TOAST_TYPES.ERROR);
            return false;
        }

        return true;
    };

    const save = () => {
        if (!editing) return;

        if (!validate()) return;

        const isSame =
            editing.id &&
            users.find(
                (u) =>
                    u.id === editing.id &&
                    u.name === editing.name &&
                    u.role === editing.role
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
                    role: editing.role,
                    active: true
                },
                ...prev
            ]);

            showToast("Usuario creado", TOAST_TYPES.SUCCESS);
        } else {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === editing.id
                        ? { ...u, name: editing.name, role: editing.role }
                        : u
                )
            );

            showToast("Usuario actualizado", TOAST_TYPES.SUCCESS);
        }

        close();
    };

    const toggleActive = (id: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, active: !u.active } : u
            )
        );

        showToast("Estado actualizado", TOAST_TYPES.SUCCESS);
    };

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
            { key: "name", label: "Nombre" },
            { key: "role", label: "Rol" },
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
        []
    );

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
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
                    titulo={editing?.id ? "Editar usuario" : "Crear usuario"}
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

                        <FormField label="Rol">
                            <Select
                                value={editing?.role || ""}
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev ? { ...prev, role: e.target.value } : prev
                                    )
                                }
                            >
                                <option value="">Seleccionar rol</option>
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </Select>
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