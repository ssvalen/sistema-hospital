import { useState } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import type { TableAction, TableColumn } from "@/shared/types/table/TableTypes";

import { faAdd, faPen } from "@fortawesome/free-solid-svg-icons";
import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";
import { HttpError } from "@/shared/errors/HttpError";

import { useStorePaginated } from "../../hooks/store/useStorePaginated";
import { useCreateStore } from "../../hooks/store/useCreateStore";
import { useUpdateStore } from "../../hooks/store/useUpdateStore";

import type { Store } from "../../domain/entities/Store";
import type { RequestStoreQueryParams } from "../../types/StoreTypes";

type StoreForm = {
    id?: number;
    storeName: string;
    storeAddress: string;
};

const StorePage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const {
        items: stores,
        totalElements,
        isLoading,
        isFetching,
    } = useStorePaginated(page - 1, pageSize);

    const createStore = useCreateStore();
    const updateStore = useUpdateStore();

    const isProcessing =
        createStore.isPending || updateStore.isPending;

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<StoreForm | null>(null);

    const openCreate = () => {
        setEditing({
            storeName: "",
            storeAddress: "",
        });
        setOpen(true);
    };

    const openEdit = (store: Store) => {
        setEditing({
            id: store.id,
            storeName: store.name,
            storeAddress: store.address,
        });
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setEditing(null);
    };

    const columns: TableColumn[] = [
        {
            key: "name",
            label: "Nombre bodega",
            sortable: true,
        },
        {
            key: "address",
            label: "Dirección",
        },
        {
            key: "totalProducts",
            label: "Total productos",
            sortable: true,
        },
        {
            key: "actions",
            label: "Acciones",
            hasActions: true,
        },
    ];

    const validate = () => {
        if (!editing?.storeName.trim()) {
            showToast(
                "El nombre de la bodega es obligatorio",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (!editing?.storeAddress.trim()) {
            showToast(
                "La dirección de la bodega es obligatoria",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        return true;
    };

    const save = async () => {
        if (!editing || !validate()) return;

        try {
            const payload: RequestStoreQueryParams = {
                id: editing.id,
                storeName: editing.storeName,
                storeAddress: editing.storeAddress,
            };

            if (!editing.id) {
                await createStore.mutateAsync(payload);
            } else {
                await updateStore.mutateAsync(payload);
            }

            showToast(
                `Bodega ${
                    editing.id ? "actualizada" : "creada"
                } exitosamente`,
                TOAST_TYPES.SUCCESS
            );
        } catch (error) {
            if (error instanceof HttpError) {
                showToast(error.message, TOAST_TYPES.ERROR);
                return;
            }

            showToast(
                "Error al procesar operación",
                TOAST_TYPES.ERROR
            );
        } finally {
            close();
        }
    };

    const actions: TableAction<Store>[] = [
        {
            title: "Editar",
            label: "Editar",
            icon: faPen,
            color: BUTTON_COLORS.BLUE,
            permission: PERMISSIONS.ADMIN.PERMISSIONS_EDIT,
            onClick: openEdit,
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-slate-50 isolate p-6 lg:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Bodegas
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestión de bodegas
                        </p>
                    </div>

                    <CanAccess
                        permission={
                            PERMISSIONS.ADMIN.PERMISSIONS_CREATE
                        }
                    >
                        <Button
                            icon={faAdd}
                            label="Crear bodega"
                            color="blue"
                            onClick={openCreate}
                        />
                    </CanAccess>
                </div>

                <DataTable<Store>
                    columns={columns}
                    loading={isLoading || isFetching}
                    data={stores}
                    page={page}
                    pageSize={pageSize}
                    total={totalElements}
                    onPageChange={setPage}
                    actions={actions}
                />
            </div>

            <Modal
                abierto={open}
                onClose={close}
                titulo={
                    editing?.id
                        ? "Editar bodega"
                        : "Crear bodega"
                }
                size="md"
            >
                <div className="space-y-4">
                    <FormField label="Nombre bodega">
                        <Input
                            value={editing?.storeName || ""}
                            onChange={(e) =>
                                setEditing((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              storeName:
                                                  e.target.value,
                                          }
                                        : prev
                                )
                            }
                        />
                    </FormField>

                    <FormField label="Dirección">
                        <Input
                            value={editing?.storeAddress || ""}
                            onChange={(e) =>
                                setEditing((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              storeAddress:
                                                  e.target.value,
                                          }
                                        : prev
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

                        <Button
                            label={
                                isProcessing
                                    ? "Guardando..."
                                    : "Guardar"
                            }
                            color="blue"
                            onClick={save}
                            disabled={isProcessing}
                        />
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
        </>
    );
};

export default StorePage;