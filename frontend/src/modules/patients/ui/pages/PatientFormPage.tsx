import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import FormField from "@/shared/components/forms/FormField";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import {
    faArrowLeft,
    faSave
} from "@fortawesome/free-solid-svg-icons";

type PatientForm = {
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    dpi: string;
    phone: string;
    email: string;
    address: string;
    emergencyName: string;
    emergencyPhone: string;
    bloodType: string;
    allergies: string;
    chronicDiseases: string;
};

const emptyForm: PatientForm = {
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    dpi: "",
    phone: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    bloodType: "",
    allergies: "",
    chronicDiseases: ""
};

// MOCK DB
const mockPatients: Record<string, PatientForm> = {
    "1": {
        firstName: "Juan",
        lastName: "Pérez",
        gender: "M",
        birthDate: "1990-01-01",
        dpi: "1234567890101",
        phone: "5555-1111",
        email: "juan@example.com",
        address: "Guatemala",
        emergencyName: "Ana Pérez",
        emergencyPhone: "5555-9999",
        bloodType: "O+",
        allergies: "Ninguna",
        chronicDiseases: "Diabetes"
    }
};

const PatientFormPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = !!id;

    const { toast, showToast, hideToast } =
        useToast();

    // 🚀 instant preload without flicker
    const initialForm = useMemo(() => {
        if (!id) return emptyForm;

        return (
            mockPatients[id] || emptyForm
        );
    }, [id]);

    const [form, setForm] =
        useState<PatientForm>(initialForm);

    const [saving, setSaving] =
        useState(false);

    const handleChange = (
        key: keyof PatientForm,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const validate = () => {
        if (!form.firstName.trim()) {
            showToast(
                "El nombre es obligatorio",
                TOAST_TYPES.ERROR
            );

            return false;
        }

        if (!form.lastName.trim()) {
            showToast(
                "El apellido es obligatorio",
                TOAST_TYPES.ERROR
            );

            return false;
        }

        return true;
    };

    const save = () => {
        if (!validate()) return;

        setSaving(true);

        setTimeout(() => {
            showToast(
                isEdit
                    ? "Paciente actualizado"
                    : "Paciente creado",
                TOAST_TYPES.SUCCESS
            );

            setSaving(false);

            navigate("/admin/patients");
        }, 600);
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                        <h1 className="text-2xl font-semibold text-slate-800">
                            {isEdit
                                ? "Editar paciente"
                                : "Nuevo paciente"}
                        </h1>

                        <p className="text-sm text-slate-500">
                            {isEdit
                                ? "Actualiza la información del paciente"
                                : "Registro de nuevo paciente"}
                        </p>

                    </div>

                    <Button
                        icon={faArrowLeft}
                        label="Volver"
                        color="gray"
                        variant="outline"
                        onClick={() =>
                            navigate(
                                "/admin/patients"
                            )
                        }
                    />

                </div>

                <div className="space-y-6">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Información personal
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <FormField label="Nombres">
                                <Input
                                    value={
                                        form.firstName
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField label="Apellidos">
                                <Input
                                    value={
                                        form.lastName
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField label="Género">
                                <Select
                                    value={
                                        form.gender
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "gender",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option value="M">
                                        Masculino
                                    </option>

                                    <option value="F">
                                        Femenino
                                    </option>
                                </Select>
                            </FormField>

                            <FormField label="Fecha nacimiento">
                                <Input
                                    type="date"
                                    value={
                                        form.birthDate
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "birthDate",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField label="DPI">
                                <Input
                                    value={form.dpi}
                                    onChange={(e) =>
                                        handleChange(
                                            "dpi",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Contacto
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <FormField label="Teléfono">
                                <Input
                                    value={
                                        form.phone
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField label="Correo">
                                <Input
                                    value={
                                        form.email
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <div className="md:col-span-2">

                                <FormField label="Dirección">
                                    <Input
                                        value={
                                            form.address
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                    />
                                </FormField>

                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Emergencia
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <FormField label="Contacto">
                                <Input
                                    value={
                                        form.emergencyName
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "emergencyName",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField label="Teléfono">
                                <Input
                                    value={
                                        form.emergencyPhone
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "emergencyPhone",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Información médica
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <FormField label="Tipo sangre">
                                <Select
                                    value={
                                        form.bloodType
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "bloodType",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option value="A+">
                                        A+
                                    </option>

                                    <option value="B+">
                                        B+
                                    </option>

                                    <option value="O+">
                                        O+
                                    </option>

                                    <option value="AB+">
                                        AB+
                                    </option>
                                </Select>
                            </FormField>

                            <FormField label="Alergias">
                                <Input
                                    value={
                                        form.allergies
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "allergies",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <div className="md:col-span-2">

                                <FormField label="Enfermedades crónicas">
                                    <Input
                                        value={
                                            form.chronicDiseases
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "chronicDiseases",
                                                e.target.value
                                            )
                                        }
                                    />
                                </FormField>

                            </div>

                        </div>

                    </div>

                    <div className="flex justify-end gap-3">

                        <Button
                            label="Cancelar"
                            color="gray"
                            variant="outline"
                            onClick={() =>
                                navigate(
                                    "/admin/patients"
                                )
                            }
                        />

                        <Button
                            icon={faSave}
                            label={
                                saving
                                    ? "Guardando..."
                                    : isEdit
                                    ? "Actualizar"
                                    : "Guardar"
                            }
                            color="blue"
                            onClick={save}
                        />

                    </div>

                </div>

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

export default PatientFormPage;