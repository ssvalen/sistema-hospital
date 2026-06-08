import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";
import Toast from "@/shared/components/Toast";
import CanAccess from "@/shared/components/permissions/CanAccess";

import { useToast } from "@/shared/hooks/useToast";

import {
    faArrowLeft,
    faPen,
    faChevronDown,
    faChevronUp,
    faUserDoctor
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PERMISSIONS } from "@/shared/utils/permissions";

import { usePatientById } from "@/modules/patients/hooks/usePatientById";
import { useGetAppointmentsByPatient } from "@/modules/appointments/hooks/appointments/useGetAppointmentsByPatient";

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

    const { data: patientData } = usePatientById(Number(id));
    const { data: appointmentsData } = useGetAppointmentsByPatient(Number(id));

    console.log("Appointments data:", appointmentsData);

    const patient = {
        id: patientData?.id ?? id,
        code: (patientData as any)?.code ?? "EXP-000001",
        firstName: (patientData as any)?.nombre ?? "Juan",
        lastName: (patientData as any)?.apellido ?? "Pérez",
        gender: (patientData as any)?.genero ?? "Masculino",
        age: (patientData as any)?.edad ?? 35,
        phone: (patientData as any)?.telefono ?? "5555-1111",
        email: (patientData as any)?.email ?? "juan@example.com",
        address: (patientData as any)?.direccion ?? "Ciudad de Guatemala",
        bloodType: (patientData as any)?.tipoSangre ?? "O+",
        allergies: (patientData as any)?.alergias ?? "Penicilina",
        chronicDiseases: (patientData as any)?.enfermedadesCronicas ?? "Diabetes",
        active: (patientData as any)?.activo ?? true
    };


    const parseDescription = (description: string) => {
        const diagnosisMatch = description.match(
            /Diagnóstico:\s*([\s\S]*?)\s*Tratamiento:/i
        );

        const treatmentMatch = description.match(
            /Tratamiento:\s*([\s\S]*?)\s*Observaciones:/i
        );

        const notesMatch = description.match(
            /Observaciones:\s*([\s\S]*)/i
        );

        return {
            diagnosis: diagnosisMatch?.[1]?.trim() ?? "",
            treatment: treatmentMatch?.[1]?.trim() ?? "",
            notes: notesMatch?.[1]?.trim() ?? ""
        };
    };

    const consultations: Consultation[] =
        appointmentsData?.map((appointment) => {
            const parsed = parseDescription(
                appointment.description
            );

            return {
                id: appointment.id.toString(),

                date: appointment.appointment.date,

                doctor: `${appointment.doctor.fullName} - ${appointment.doctor.specialty}`,

                reason: "Consulta médica",

                diagnosis: parsed.diagnosis,

                treatment: parsed.treatment
                    ? [parsed.treatment]
                    : [],

                medications: appointment.medications.map(
                    (medication) =>
                        `${medication.commercialName} - ${medication.dosage} (${medication.quantity} ${medication.medicalUnit})`
                ),

                notes: parsed.notes
            };
        }) ?? [];


    const doctors = [
        ...new Set(
            consultations.map(
                (consultation) => consultation.doctor
            )
        )
    ];
    const filteredConsultations = useMemo(() => {
        return consultations
            .filter((consultation) => {
                const searchText = search.toLowerCase();

                const matchesSearch =
                    consultation.reason.toLowerCase().includes(searchText) ||
                    consultation.diagnosis.toLowerCase().includes(searchText) ||
                    consultation.doctor.toLowerCase().includes(searchText) ||
                    consultation.medications.some((m) =>
                        m.toLowerCase().includes(searchText)
                    );

                const matchesDoctor =
                    doctorFilter === "all"
                        ? true
                        : consultation.doctor === doctorFilter;

                return matchesSearch && matchesDoctor;
            })
            .sort((a, b) => {
                if (sortOrder === "desc") {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                }

                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
    }, [consultations, search, doctorFilter, sortOrder]);

    const toggleConsultation = (consultationId: string) => {
        setOpenConsultation((prev) =>
            prev === consultationId ? null : consultationId
        );
    };



    return (
        <>
            <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    <div className="space-y-2">

                        <div className="flex items-center gap-3">

                            <h1 className="text-2xl font-semibold text-slate-800">
                                {patient.firstName} {patient.lastName}
                            </h1>

                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${patient.active
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {patient.active ? "Activo" : "Inactivo"}
                            </span>

                        </div>

                    

                    </div>

                    <div className="flex gap-3">

                        <Button
                            icon={faArrowLeft}
                            label="Volver"
                            color="gray"
                            variant="outline"
                            onClick={() => navigate("/admin/patients")}
                        />

                        <CanAccess permission={PERMISSIONS.PATIENT.EDIT}>
                            <Button
                                icon={faPen}
                                label="Editar"
                                color="blue"
                                onClick={() =>
                                    navigate(`/admin/patients/${id}/edit`)
                                }
                            />
                        </CanAccess>

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Género</p>
                        <p className="text-lg font-semibold text-slate-700">
                            {patient.gender}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Edad</p>
                        <p className="text-lg font-semibold text-slate-700">
                            {patient.age} años
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Teléfono</p>
                        <p className="text-lg font-semibold text-slate-700">
                            {patient.phone}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm text-slate-400">Dirección</p>
                        <p className="text-lg font-semibold text-slate-700">
                            {patient.address}
                        </p>
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

                        <CanAccess permission={PERMISSIONS.APPOINTMENT.CREATE}>
                            <Button
                                icon={faUserDoctor}
                                label="Nueva consulta"
                                title="Agendar nueva consulta"
                                color="blue"
                                onClick={() =>
                                    navigate("/admin/appointments/new", {
                                        state: {
                                            patientId: String(patient.id),
                                            patientName: `${patient.firstName} ${patient.lastName}`,
                                            patientCode: patient.code
                                        }
                                    })
                                }
                            />
                        </CanAccess>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <FormField label="Buscar">
                            <Input
                                placeholder="Diagnóstico, motivo, medicamento..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </FormField>

                        <FormField label="Médico">
                            <Select
                                value={doctorFilter}
                                onChange={(e) => setDoctorFilter(e.target.value)}
                            >
                                <option value="all">Todos</option>

                                {doctors.map((doctor) => (
                                    <option
                                        key={doctor}
                                        value={doctor}
                                    >
                                        {doctor}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Orden">
                            <Select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="desc">Más recientes</option>
                                <option value="asc">Más antiguas</option>
                            </Select>
                        </FormField>

                    </div>

                    <div className="space-y-4">

                        {filteredConsultations.map((consultation) => {
                            const isOpen =
                                openConsultation === consultation.id;

                            return (
                                <div
                                    key={consultation.id}
                                    className="border border-slate-200 rounded-2xl overflow-hidden"
                                >

                                    <button
                                        onClick={() =>
                                            toggleConsultation(consultation.id)
                                        }
                                        className="w-full p-5 bg-white hover:bg-slate-50 transition flex items-center justify-between text-left"
                                    >

                                        <div className="space-y-1">

                                            <div className="flex items-center gap-3 flex-wrap">

                                                <h3 className="font-semibold text-slate-700">
                                                    Consulta médica
                                                </h3>

                                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                                    {consultation.date}
                                                </span>

                                            </div>

                                            <p className="text-sm text-slate-500">
                                                Dr. {consultation.doctor}
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
                                                    {consultation.reason}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">
                                                    Diagnóstico
                                                </p>
                                                <p className="font-medium text-slate-700">
                                                    {consultation.diagnosis}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400 mb-2">
                                                    Tratamiento
                                                </p>

                                                <ul className="space-y-2">
                                                    {consultation.treatment.map(
                                                        (item, index) => (
                                                            <li
                                                                key={index}
                                                                className="text-sm text-slate-700 flex items-start gap-2"
                                                            >
                                                                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                                                <span>{item}</span>
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
                                                        (item, index) => (
                                                            <li
                                                                key={index}
                                                                className="text-sm text-slate-700 flex items-start gap-2"
                                                            >
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                                                                <span>{item}</span>
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
                                                    {consultation.notes}
                                                </p>
                                            </div>

                                        </div>
                                    )}

                                </div>
                            );
                        })}

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