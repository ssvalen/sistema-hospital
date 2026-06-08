import { useState } from "react";
import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";
import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import type { Permission } from "@/modules/admin/domain/entities/Permission";
import type { TableAction, TableColumn } from "@/shared/types/table/TableTypes";

import { faAdd, faKey, faPeace, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PERMISSIONS } from "@/shared/utils/permissions";
import CanAccess from "@/shared/components/permissions/CanAccess";
import { HttpError } from "@/shared/errors/HttpError";
import ConfirmationModal from "@/shared/components/ConfirmationModal";

import { useMedicinePaginated } from "../../hooks/medicine/useMedicinePaginated";
import type { Medicine } from "../../domain/entities/Medicine";
import { useCreateMedicine } from "../../hooks/medicine/useCreateMedicine";
import { useUpdateMedicine } from "../../hooks/medicine/useUpdateMedicine";
import type { RequestMedicineQueryParams } from "../../types/MedicineTypes";
// import { useInactivatePermission } from "../../hooks/useInactivatePermission";

type MedicineForm = {
    id?: number;
    name: string;
    principalActive: string;
    unit: string;
};

const InventoryPage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const {
        items: medicine,
        totalElements,
        isLoading,
        isFetching,
    } = useMedicinePaginated(page - 1, pageSize);

    console.log(medicine)

    const createMedicine = useCreateMedicine()
    const updateMedicine = useUpdateMedicine()

    const isProccesing = createMedicine.isPending || updateMedicine.isPending

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<MedicineForm | null>(null);

    const openCreate = () => {
        setEditing({
            name: "",
            principalActive: "",
            unit: ""
        });
        setOpen(true);
    };

    const openEdit = (medicine: Medicine) => {
        setEditing({
            id: medicine.id,
            name: medicine.commercialName,
            principalActive: medicine.principalActive,
            unit: medicine.unit
        });
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setEditing(null);
    };


    const columns: TableColumn[] = [
        { key: "commercialName", label: "Nombre medicamento", sortable: true },
        { key: "principalActive", label: "Activo principal" },
        { key: "stock", label: "Stock", sortable: true },
        { key: "treatments", label: "Veces recetado", sortable: true },
        { key: "actions", label: "Acciones", hasActions: true },
    ]

    const validate = () => {
        if (!editing?.name.trim()) {
            showToast("El nombre es obligatorio", TOAST_TYPES.ERROR);
            return false;
        }
        if (!editing?.principalActive.trim()) {
            showToast("El principio activo del médicamento es obligatorio", TOAST_TYPES.ERROR);
            return false;
        }
        if (!editing?.unit.trim()) {
            showToast("La unidad de medida es obligatorio", TOAST_TYPES.ERROR);
            return false;
        }
        return true;
    };

    const save = async () => {
        if (!editing || !validate()) return;

        try {

            const payload: RequestMedicineQueryParams = {
                id: editing.id ?? 0,
                commercialName: editing.name,
                principalActive: editing.principalActive,
                unit: editing.unit
            }

            if (!editing.id) {
                await createMedicine.mutateAsync(payload)
            } else {
                await updateMedicine.mutateAsync(payload)
            }

            showToast(`Producto ${editing.id ? 'actualizado' : 'creado'} exitosamente`, TOAST_TYPES.SUCCESS)

        } catch (error) {
            if (error instanceof HttpError) {
                showToast(error.message, TOAST_TYPES.ERROR)
                return
            }

            showToast("Error al procesar operacion", TOAST_TYPES.ERROR)
        } finally {
            close()
        }


    };


    const actions: TableAction<Medicine>[] = [
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
                        <h1 className="text-2xl font-semibold">Médicamentos</h1>
                        <p className="text-sm text-slate-500">Gestión de médicamentos</p>
                    </div>

                    <CanAccess permission={PERMISSIONS.ADMIN.PERMISSIONS_CREATE}>
                        <Button
                            icon={faAdd}
                            label="Crear producto"
                            color="blue"
                            onClick={openCreate}
                        />
                    </CanAccess>
                </div>

                <DataTable<Medicine>
                    columns={columns}
                    loading={isLoading || isFetching}
                    data={medicine}
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
                titulo={editing?.id ? "Editar producto" : "Crear producto"}
                size="md"
            >
                <div className="space-y-4">

                    <FormField label="Nombre medicamento">
                        <Input
                            value={editing?.name || ""}
                            onChange={(e) =>
                                setEditing((prev) =>
                                    prev ? { ...prev, name: e.target.value } : prev
                                )
                            }
                        />
                    </FormField>
                    <FormField label="Principio activo">
                        <Input
                            value={editing?.principalActive || ""}
                            onChange={(e) =>
                                setEditing((prev) =>
                                    prev ? { ...prev, principalActive: e.target.value } : prev
                                )
                            }
                        />
                    </FormField>
                    <FormField label="Unidad medida">
                        <Input
                            value={editing?.unit || ""}
                            onChange={(e) =>
                                setEditing((prev) =>
                                    prev ? { ...prev, unit: e.target.value } : prev
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
                            label={isProccesing ? "Guardando..." : "Guardar"}
                            color="blue"
                            onClick={save}
                            disabled={isProccesing}
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

export default InventoryPage;