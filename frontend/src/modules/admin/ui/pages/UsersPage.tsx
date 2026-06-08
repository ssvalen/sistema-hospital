import { useMemo, useState, useCallback, useEffect } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import type { TableColumn } from "@/shared/types/table/TableTypes";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import type { Role } from "@/modules/admin/domain/entities/Role";
import type { User } from "@/modules/admin/domain/entities/User";
import { useGetAllRoles } from "@/modules/admin/hooks/roles/useGetAllRoles";

import type { UserRequestParams } from "../../types/UserTypes";
import { usePaginatedUsers } from "../../hooks/user/usePaginatedUsers";
import { useRolesByUser } from "../../hooks/user/useRolesByUser";
import { useCreateUser } from "../../hooks/user/useCreateUser";
import { create } from "zustand";
import { HttpError } from "@/shared/errors/HttpError";
import { useUpdateUser } from "../../hooks/user/useUpdateUser";

type UserForm = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: number[];
};

type FormErrors = {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roles?: string;
};

const initialForm: UserForm = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: []
};

const UsersPage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UserForm | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [searchRole, setSearchRole] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const {
        items: users,
        totalElements,
        isLoading,
    } = usePaginatedUsers(page - 1, pageSize);


    const { data: roles = [] } = useGetAllRoles();
    const { data: userRoles = [] } = useRolesByUser(selectedUserId ?? 0, {
        enabled: !!selectedUserId && open
    });

    const createUser = useCreateUser()
    const updateUser = useUpdateUser()

    const isSaving = createUser.isPending || updateUser.isPending

    useEffect(() => {
        if (!editing?.id) return;
        if (!userRoles) return;

        setEditing((prev) => {
            if (!prev) return prev;

            const newRoles = userRoles.map((r: any) => r.id);

            if (JSON.stringify(prev.roles) === JSON.stringify(newRoles)) {
                return prev;
            }

            return {
                ...prev,
                roles: newRoles
            };
        });
    }, [userRoles, editing?.id]);

    const usersData = useMemo(() => {
        return users.map((user) => ({
            ...user,
            statusLabel: user.status ? "ACTIVO" : "INACTIVO"
        }));
    }, [users]);

    const openCreate = useCallback(() => {
        setSelectedUserId(null);
        setEditing(initialForm);
        setErrors({});
        setSearchRole("");
        setOpen(true);
    }, []);

    const openEdit = useCallback((user: User) => {
        setSelectedUserId(user.id);
        console.log(user)
        setEditing({
            id: user.id,
            username: user.username,
            firstName: user.name,
            lastName: user.lastname,
            email: user.email,
            password: "",
            roles: []
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
        setSelectedUserId(null);
    }, []);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validate = useCallback(() => {
        if (!editing) return false;

        const newErrors: FormErrors = {};

        if (!editing.username.trim() || editing.username.length < 3)
            newErrors.username = "Mínimo 3 caracteres";

        if (!editing.email.trim() || !isValidEmail(editing.email))
            newErrors.email = "Correo inválido";

        if (!editing.id) {
            if (!editing.firstName.trim() || editing.firstName.length < 3)
                newErrors.firstName = "Mínimo 3 caracteres";

            if (!editing.lastName.trim() || editing.lastName.length < 3)
                newErrors.lastName = "Mínimo 3 caracteres";

            if (editing.password.length < 6)
                newErrors.password = "Mínimo 6 caracteres";
        }

        if (editing.roles.length === 0)
            newErrors.roles = "Selecciona al menos un rol";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }, [editing]);

    const buildPayload = useCallback((form: UserForm): UserRequestParams => {
        return {
            id: form.id,
            username: form.username.trim(),
            email: form.email.trim(),
            status: true,
            roles: form.roles,
            name: form.firstName.trim(),
            lastname: form.lastName.trim(),
            password: form.password
        };
    }, []);

    const save = useCallback(async () => {
        if (!editing || !validate()) return;

        const payload = buildPayload(editing);
        try {
            if (editing.id) {
                await updateUser.mutateAsync(payload)
                showToast("Usuario actualizado exitosamente", TOAST_TYPES.SUCCESS)
                return;
            }

            await createUser.mutateAsync(payload);
            showToast("Usuario creado exitosamente", TOAST_TYPES.SUCCESS)
        } catch (error) {

            if (error instanceof HttpError) {
                showToast(error.message, TOAST_TYPES.ERROR)
            }
            showToast("Error durante operacion de usuario.", TOAST_TYPES.ERROR)
        } finally {
            close()
        }

    }, [
        editing,
        validate,
        buildPayload,
        createUser,
        updateUser
    ]);

    const toggleActive = useCallback(() => {
        showToast("Acción futura con mutation", TOAST_TYPES.SUCCESS);
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

        setErrors((p) => ({ ...p, roles: undefined }));
    }, []);

    const filteredRoles = useMemo(() => {
        return roles.filter((r: Role) =>
            r.roleName.toLowerCase().includes(searchRole.toLowerCase())
        );
    }, [roles, searchRole]);

    const actions = useMemo(
        () => [
            { title: "Editar", label: "Editar", color: "blue", onClick: openEdit },
        ],
        [openEdit, toggleActive]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            { key: "username", label: "Usuario" },
            { key: "fullname", label: "Nombre"},
            { key: "email", label: "Correo" },
            { key: "statusLabel", label: "Estado" },
            { key: "actions", label: "Acciones", hasActions: true }
        ],
        []
    );

    if (isLoading) return <div className="p-6">Cargando usuarios...</div>;

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
                        title="Crear nuevo usuario"
                        color="blue"
                        onClick={openCreate}
                    />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={usersData}
                        actions={actions as any}
                        page={page}
                        pageSize={pageSize}
                        total={totalElements}
                        onPageChange={(p) => setPage(p)}
                    />
                </div>

                <Modal
                    abierto={open}
                    onClose={close}
                    titulo={editing?.id ? "Editar usuario" : "Crear usuario"}
                    size="md"
                >
                    <div className="space-y-5">

                        <FormField label="Usuario" error={errors.username}>
                            <Input
                                value={editing?.username || ""}
                                onChange={(e) =>
                                    setEditing((p) =>
                                        p ? { ...p, username: e.target.value } : p
                                    )
                                }
                            />
                        </FormField>
                        <FormField label="Nombre" error={errors.firstName}>
                            <Input
                                value={editing?.firstName || ""}
                                onChange={(e) =>
                                    setEditing((p) =>
                                        p ? { ...p, firstName: e.target.value } : p
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Apellidos" error={errors.lastName}>
                            <Input
                                value={editing?.lastName || ""}
                                onChange={(e) =>
                                    setEditing((p) =>
                                        p ? { ...p, lastName: e.target.value } : p
                                    )
                                }
                            />
                        </FormField>
                        {!editing?.id && (
                            <FormField label="Contraseña" error={errors.password}>
                                <Input
                                    type="password"
                                    value={editing?.password || ""}
                                    onChange={(e) =>
                                        setEditing((p) =>
                                            p ? { ...p, password: e.target.value } : p
                                        )
                                    }
                                />
                            </FormField>
                        )}

                        <FormField label="Correo" error={errors.email}>
                            <Input
                                value={editing?.email || ""}
                                onChange={(e) =>
                                    setEditing((p) =>
                                        p ? { ...p, email: e.target.value } : p
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Roles" error={errors.roles}>
                            <Input
                                placeholder="Buscar roles..."
                                value={searchRole}
                                onChange={(e) => setSearchRole(e.target.value)}
                            />

                            <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto mt-3">
                                {filteredRoles.map((role) => {
                                    const selected = editing?.roles.includes(role.id);

                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => toggleRole(role.id)}
                                            className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-colors ${selected
                                                ? "bg-blue-50"
                                                : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-slate-700">
                                                    {role.roleName}
                                                </div>

                                                <div
                                                    className={`text-sm ${selected
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                        }`}
                                                >
                                                    {selected ? "Seleccionado" : "Seleccionar"}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </FormField>

                        <div className="flex justify-end gap-3 pt-2">
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    label="Cancelar"
                                    color="gray"
                                    onClick={close}
                                    disabled={isSaving}
                                />

                                <Button
                                    label={
                                        isSaving
                                            ? editing?.id
                                                ? "Actualizando..."
                                                : "Guardando..."
                                            : editing?.id
                                                ? "Actualizar"
                                                : "Guardar"
                                    }
                                    color="blue"
                                    onClick={save}
                                    disabled={isSaving}
                                />
                            </div>
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