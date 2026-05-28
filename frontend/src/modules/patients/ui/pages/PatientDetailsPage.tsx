import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";

import { useToast } from "@/shared/hooks/useToast";

import {
    faArrowLeft,
    faPen,
    faChevronDown,
    faChevronUp,
    faUserDoctor
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Consultation = {
    id: string;
    date: string;
    doctor: string;
    reason: string;
    diagnosis: string;
    treatment: string[];
    medications: string[];
    notes: string;
};

const PatientDetailsPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const { toast, hideToast } = useToast();

    const [openConsultation, setOpenConsultation] =
        useState<string | null>(null);

    const [search, setSearch] = useState("");

    const [doctorFilter, setDoctorFilter] =
        useState("all");

    const [sortOrder, setSortOrder] =
        useState("desc");

    // MOCK DATA
    const patient = {
        id,
        code: "EXP-000001",
        firstName: "Juan",
        lastName: "Pérez",
        gender: "Masculino",
        age: 35,
        phone: "5555-1111",
        email: "juan@example.com",
        address: "Ciudad de Guatemala",
        bloodType: "O+",
        allergies: "Penicilina",
        chronicDiseases: "Diabetes",
        active: true
    };

    const consultations: Consultation[] = [
        {
            id: "1",
            date: "2026-05-01",
            doctor: "Dr. López",
            reason: "Dolor de cabeza intenso",
            diagnosis: "Migraña",
            treatment: [
                "Reposo",
                "Hidratación",
                "Evitar pantallas"
            ],
            medications: [
                "Ibuprofeno 400mg cada 8h por 5 días"
            ],
            notes:
                "Paciente estable, sin signos neurológicos."
        },
        {
            id: "2",
            date: "2026-04-20",
            doctor: "Dra. Méndez",
            reason: "Control diabetes",
            diagnosis: "Diabetes tipo 2",
            treatment: [
                "Dieta baja en azúcar",
                "Ejercicio diario"
            ],
            medications: [
                "Metformina 850mg diaria"
            ],
            notes:
                "Paciente estable, glucosa controlada."
        },
        {
            id: "3",
            date: "2026-03-10",
            doctor: "Dr. López",
            reason: "Fiebre y tos",
            diagnosis: "Infección respiratoria",
            treatment: [
                "Reposo",
                "Hidratación",
                "Control temperatura"
            ],
            medications: [
                "Acetaminofén 500mg",
                "Jarabe para tos"
            ],
            notes:
                "Paciente responde bien al tratamiento."
        }
    ];

    const filteredConsultations = useMemo(() => {
        return consultations
            .filter((consultation) => {
                const searchText =
                    search.toLowerCase();

                const matchesSearch =
                    consultation.reason
                        .toLowerCase()
                        .includes(searchText) ||
                    consultation.diagnosis
                        .toLowerCase()
                        .includes(searchText) ||
                    consultation.doctor
                        .toLowerCase()
                        .includes(searchText) ||
                    consultation.medications.some(
                        (m) =>
                            m
                                .toLowerCase()
                                .includes(searchText)
                    );

                const matchesDoctor =
                    doctorFilter === "all"
                        ? true
                        : consultation.doctor ===
                          doctorFilter;

                return (
                    matchesSearch &&
                    matchesDoctor
                );
            })
            .sort((a, b) => {
                if (sortOrder === "desc") {
                    return (
                        new Date(
                            b.date
                        ).getTime() -
                        new Date(
                            a.date
                        ).getTime()
                    );
                }

                return (
                    new Date(
                        a.date
                    ).getTime() -
                    new Date(
                        b.date
                    ).getTime()
                );
            });
    }, [
        consultations,
        search,
        doctorFilter,
        sortOrder
    ]);

    const toggleConsultation = (
        consultationId: string
    ) => {
        setOpenConsultation((prev) =>
            prev === consultationId
                ? null
                : consultationId
        );
    };

    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    <div className="space-y-2">

                        <div className="flex items-center gap-3">

                            <h1 className="text-2xl font-semibold text-slate-800">
                                {patient.firstName}{" "}
                                {patient.lastName}
                            </h1>

                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    patient.active
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {patient.active
                                    ? "Activo"
                                    : "Inactivo"}
                            </span>

                        </div>

                        <p className="text-sm text-slate-500">
                            Expediente:
                            {" "}
                            {patient.code}
                        </p>

                    </div>

                    <div className="flex gap-3">

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

                        <Button
                            icon={faPen}
                            label="Editar"
                            color="blue"
                            onClick={() =>
                                navigate(
                                    `/admin/patients/${id}/edit`
                                )
                            }
                        />

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">
                            Género
                        </p>

                        <p className="text-lg font-semibold text-slate-700">
                            {patient.gender}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">
                            Edad
                        </p>

                        <p className="text-lg font-semibold text-slate-700">
                            {patient.age} años
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">
                            Tipo sangre
                        </p>

                        <p className="text-lg font-semibold text-slate-700">
                            {patient.bloodType}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">
                            Teléfono
                        </p>

                        <p className="text-lg font-semibold text-slate-700">
                            {patient.phone}
                        </p>
                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                    <h2 className="text-lg font-semibold text-slate-700 mb-6">
                        Información general
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-5">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Correo electrónico
                                </p>

                                <p className="font-medium text-slate-700">
                                    {patient.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Dirección
                                </p>

                                <p className="font-medium text-slate-700">
                                    {patient.address}
                                </p>
                            </div>

                        </div>

                        <div className="space-y-5">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Alergias
                                </p>

                                <p className="font-medium text-slate-700">
                                    {patient.allergies}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Enfermedades crónicas
                                </p>

                                <p className="font-medium text-slate-700">
                                    {patient.chronicDiseases}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-700">
                                Historial clínico
                            </h2>

                            <p className="text-sm text-slate-400">
                                Consultas médicas registradas
                            </p>
                        </div>

                        <Button
                            icon={faUserDoctor}
                            label="Nueva consulta"
                            color="blue"
                            onClick={() => {}}
                        />

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <FormField label="Buscar">
                            <Input
                                placeholder="Diagnóstico, motivo, medicamento..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />
                        </FormField>

                        <FormField label="Médico">
                            <Select
                                value={doctorFilter}
                                onChange={(e) =>
                                    setDoctorFilter(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    Todos
                                </option>

                                <option value="Dr. López">
                                    Dr. López
                                </option>

                                <option value="Dra. Méndez">
                                    Dra. Méndez
                                </option>
                            </Select>
                        </FormField>

                        <FormField label="Orden">
                            <Select
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="desc">
                                    Más recientes
                                </option>

                                <option value="asc">
                                    Más antiguas
                                </option>
                            </Select>
                        </FormField>

                    </div>

                    <div className="space-y-4">

                        {filteredConsultations.map(
                            (consultation) => {
                                const isOpen =
                                    openConsultation ===
                                    consultation.id;

                                return (
                                    <div
                                        key={
                                            consultation.id
                                        }
                                        className="border border-slate-200 rounded-2xl overflow-hidden"
                                    >

                                        <button
                                            onClick={() =>
                                                toggleConsultation(
                                                    consultation.id
                                                )
                                            }
                                            className="w-full p-5 bg-white hover:bg-slate-50 transition flex items-center justify-between text-left"
                                        >

                                            <div className="space-y-1">

                                                <div className="flex items-center gap-3 flex-wrap">

                                                    <h3 className="font-semibold text-slate-700">
                                                        Consulta médica
                                                    </h3>

                                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                                        {
                                                            consultation.date
                                                        }
                                                    </span>

                                                </div>

                                                <p className="text-sm text-slate-500">
                                                    {
                                                        consultation.doctor
                                                    }
                                                </p>

                                            </div>

                                            <FontAwesomeIcon
                                                icon={
                                                    isOpen
                                                        ? faChevronUp
                                                        : faChevronDown
                                                }
                                                className="text-slate-400"
                                            />

                                        </button>

                                        {isOpen && (
                                            <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-6">

                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">
                                                        Motivo consulta
                                                    </p>

                                                    <p className="font-medium text-slate-700">
                                                        {
                                                            consultation.reason
                                                        }
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">
                                                        Diagnóstico
                                                    </p>

                                                    <p className="font-medium text-slate-700">
                                                        {
                                                            consultation.diagnosis
                                                        }
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400 mb-2">
                                                        Tratamiento
                                                    </p>

                                                    <ul className="space-y-2">

                                                        {consultation.treatment.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="text-sm text-slate-700 flex items-start gap-2"
                                                                >
                                                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />

                                                                    <span>
                                                                        {
                                                                            item
                                                                        }
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}

                                                    </ul>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400 mb-2">
                                                        Medicamentos
                                                    </p>

                                                    <ul className="space-y-2">

                                                        {consultation.medications.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="text-sm text-slate-700 flex items-start gap-2"
                                                                >
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />

                                                                    <span>
                                                                        {
                                                                            item
                                                                        }
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}

                                                    </ul>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">
                                                        Observaciones
                                                    </p>

                                                    <p className="text-slate-700">
                                                        {
                                                            consultation.notes
                                                        }
                                                    </p>
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )}

                        {!filteredConsultations.length && (
                            <div className="text-center py-10 text-slate-400">
                                No se encontraron consultas
                            </div>
                        )}

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

export default PatientDetailsPage;