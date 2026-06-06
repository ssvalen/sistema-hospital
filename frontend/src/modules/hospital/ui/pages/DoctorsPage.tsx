import { useMemo, useState } from "react";
import DataTable from "@/shared/components/DataTable";
import type { TableAction } from "@/shared/types/table/TableTypes";



import Modal from "@/shared/components/Modal";

import Button from "@/shared/components/forms/Button";
import { BUTTON_COLORS } from "@/shared/types/button/ButtonTypes";

import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";

import Toast from "@/shared/components/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";


import { faPen, faUserDoctor, faUserXmark } from "@fortawesome/free-solid-svg-icons";

import { PERMISSIONS } from "@/shared/utils/permissions";
import type { Doctor } from "../../domain/entities/Doctor";

import { useDoctorPaginated } from "../../hooks/doctor/useDoctorsPaginated";
import { useCreateDoctor } from "../../hooks/doctor/useCreateDoctor";
import { useUpdateDoctor } from "../../hooks/doctor/useUpdateDoctor";


type DoctorForm = {
    id?: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
};

const SPECIALTIES = [
    "Cardiología",
    "Pediatría",
    "Dermatología",
    "Neurología",
    "Ginecología",
    "Traumatología",
    "Oftalmología",
    "Psiquiatría",
    "Medicina General",
    "Endocrinología",
    "Oncología",
    "Urología",
    "Otorrinolaringología"
];

const DoctorsPage = () => {
    const { toast, showToast, hideToast } = useToast();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const {
        items: doctors = [],
        totalElements
    } = useDoctorPaginated(page - 1, pageSize);

    const createDoctor = useCreateDoctor()
    const updateDoctor = useUpdateDoctor()

    const isProcessing = createDoctor.isPending || updateDoctor.isPending


    const [open, setOpen] = useState(false);

    const [editing, setEditing] =
        useState<DoctorForm | null>(null);

    const openCreate = () => {
        setEditing({
            nombre: "",
            apellido: "",
            especialidad: "",
            telefono: "",
            email: ""
        });

        setOpen(true);
    };

    const openEdit = (doctor: Doctor) => {
        setEditing({
            id: doctor.id,
            nombre: doctor.name,
            apellido: doctor.lastName,
            especialidad: doctor.speciality,
            telefono: doctor.phoneNumber,
            email: doctor.email
        });

        setOpen(true);
    };

    const close = () => {
        setEditing(null);
        setOpen(false);
    };

    const validate = () => {
        if (!editing) return false;

        if (!editing.nombre.trim()) {
            showToast(
                "El nombre es obligatorio",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (!editing.apellido.trim()) {
            showToast(
                "El apellido es obligatorio",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (!editing.especialidad.trim()) {
            showToast(
                "La especialidad es obligatoria",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (!editing.telefono.trim()) {
            showToast(
                "El teléfono es obligatorio",
                TOAST_TYPES.ERROR
            );
            return false;
        }


        if (!/^\d+$/.test(editing.telefono)) {
            showToast(
                "El teléfono debe contener únicamente números",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (
            editing.telefono.length < 8 ||
            editing.telefono.length > 15
        ) {
            showToast(
                "El teléfono debe tener entre 8 y 15 dígitos",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        if (!editing.email.trim()) {
            showToast(
                "El correo es obligatorio",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(editing.email)) {
            showToast(
                "Correo electrónico inválido",
                TOAST_TYPES.ERROR
            );
            return false;
        }

        return true;
    };

    const save = async () => {
        if (!editing) return;

        if (!validate()) return;

        const payload = {
            id: Number(editing.id),
            name: editing.nombre.trim(),
            lastName: editing.apellido.trim(),
            speciality: editing.especialidad,
            phoneNumber: editing.telefono,
            email: editing.email.trim()
        };

        console.log(payload);

        if (editing.id) {
            try {
                await updateDoctor.mutateAsync(payload);
                showToast("Información de doctor actualizada exitosamente", TOAST_TYPES.SUCCESS);
            } catch (error) {
                showToast("Error al actualizar doctor", TOAST_TYPES.ERROR);
            }

        } else {

            try {
                await createDoctor.mutateAsync(payload);
                showToast("Doctor creado exitosamente", TOAST_TYPES.SUCCESS);
            } catch (error) {
                showToast("Error al crear doctor", TOAST_TYPES.ERROR);
            }

        }

        close();
    };

    const deleteDoctor = (doctor: Doctor) => {
        console.log(doctor.id);

        showToast(
            "Listo para eliminar doctor",
            TOAST_TYPES.SUCCESS
        );
    };

    const actions: TableAction<Doctor>[] = [
        {
            title: "Editar doctor",
            label: "Editar",
            icon: faPen,
            color: BUTTON_COLORS.GREEN,
            permission: PERMISSIONS.PATIENT.VIEW_DETAIL,
            onClick: openEdit
        },
        {
            title: "Eliminar doctor",
            label: "Eliminar",
            icon: faUserXmark,
            color: BUTTON_COLORS.RED,
            permission: PERMISSIONS.PATIENT.INACTIVATE_PATIENTS,
            onClick: deleteDoctor
        }
    ];

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Doctores
                        </h1>

                        <p className="text-sm text-slate-500">
                            Gestión de doctores
                        </p>
                    </div>

                    <Button
                        icon={faUserDoctor}
                        label="Crear doctor"
                        color="blue"
                        onClick={openCreate}
                    />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <DataTable<Doctor>
                        columns={[
                            { key: "name", label: "Nombre" },
                            { key: "lastName", label: "Apellido" },
                            { key: "speciality", label: "Especialidad" },
                            { key: "phoneNumber", label: "Teléfono" },
                            { key: "email", label: "Correo" },
                            { key: "actions", label: "Acciones", hasActions: true }
                        ]}
                        data={doctors}
                        actions={actions}
                        page={page}
                        pageSize={pageSize}
                        total={totalElements}
                        onPageChange={setPage}
                    />
                </div>

                <Modal
                    abierto={open}
                    onClose={close}
                    titulo={
                        editing?.id
                            ? "Editar doctor"
                            : "Crear doctor"
                    }
                    size="md"
                >
                    <div className="space-y-5">
                        <FormField label="Nombre">
                            <Input
                                value={editing?.nombre ?? ""}
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                nombre:
                                                    e.target
                                                        .value
                                            }
                                            : null
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Apellido">
                            <Input
                                value={editing?.apellido ?? ""}
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                apellido:
                                                    e.target
                                                        .value
                                            }
                                            : null
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Especialidad">
                            <Select
                                value={
                                    editing?.especialidad ??
                                    ""
                                }
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                especialidad:
                                                    e.target
                                                        .value
                                            }
                                            : null
                                    )
                                }
                            >
                                <option value="">
                                    Seleccionar especialidad
                                </option>

                                {SPECIALTIES.map(
                                    (speciality) => (
                                        <option
                                            key={speciality}
                                            value={
                                                speciality
                                            }
                                        >
                                            {speciality}
                                        </option>
                                    )
                                )}
                            </Select>
                        </FormField>

                        <FormField label="Teléfono">
                            <Input
                                type="number"
                                value={
                                    editing?.telefono ?? ""
                                }
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                telefono:
                                                    e.target
                                                        .value
                                            }
                                            : null
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Correo">
                            <Input
                                type="email"
                                value={editing?.email ?? ""}
                                onChange={(e) =>
                                    setEditing((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                email:
                                                    e.target
                                                        .value
                                            }
                                            : null
                                    )
                                }
                            />
                        </FormField>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                label="Cancelar"
                                color="gray"
                                variant="outline"
                                onClick={close}
                            />

                            <Button
                                label={
                                    isProcessing
                                        ? editing?.id
                                            ? "Actualizando..."
                                            : "Guardando..."
                                        : editing?.id
                                            ? "Actualizar"
                                            : "Guardar"
                                }
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

export default DoctorsPage;