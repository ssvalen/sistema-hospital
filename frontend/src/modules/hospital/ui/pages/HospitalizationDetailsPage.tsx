import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/forms/Button";

import {
    faArrowLeft,
    faRightLeft,
    faArrowRightFromBracket,
    faUserDoctor,
    faClock,
    faBuildingUser,
    faUser
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Hospitalitation } from "../../domain/entities/Hospitalitation";
import { useHospitalitationById } from "../../hooks/hospitalitation/useHospitalitationById";

import { canExecuteHospitalitationAction } from "../utils/canExecuteHospitalitationAction.ts";
import { HOSPITALITATION_ACTIONS } from "../../types/HospitalitationActions";
import type { HospitalitationStatus } from "../../types/HospitalitationStatus";
import { HOSPITALITATION_STATUS_CONFIG } from "../../types/HospitalitationStatusConfig";

const HospitalizationDetailsPage = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const { data: hospitalitationData, isLoading: hospitalitationLoading } = useHospitalitationById(Number(id))

    if (!hospitalitationData) return

    const statusStyles = HOSPITALITATION_STATUS_CONFIG[hospitalitationData.hospitalitation.status];
    const hospitalization = {
        id,

        patient: {
            id: 1,
            expediente: "EXP-000123",
            nombre: "Juan",
            apellido: "Pérez",
            edad: 45,
            genero: "Masculino",
            telefono: "5555-1111"
        },

        admissionDate: "2026-05-25",

        diagnosis:
            "Neumonía adquirida en la comunidad",

        reason:
            "Dificultad respiratoria y fiebre persistente",

        doctor:
            "Dr. Carlos López",

        area:
            "Medicina Interna",

        status:
            "HOSPITALIZADO",

        observations:
            "Paciente estable, responde adecuadamente al tratamiento y continúa bajo observación médica.",

        transfers: [
            {
                date: "2026-05-25 08:30",
                from: "Emergencia",
                to: "Medicina Interna",
                reason: "Ingreso hospitalario"
            },
            {
                date: "2026-05-27 14:10",
                from: "Medicina Interna",
                to: "Observación",
                reason: "Monitoreo clínico"
            }
        ]
    };

    const stayDays = useMemo(() => {

        const start =
            new Date(hospitalitationData.hospitalitation.startDate);

        const end = new Date();

        return Math.max(
            1,
            Math.ceil(
                (end.getTime() -
                    start.getTime()) /
                (1000 * 60 * 60 * 24)
            )
        );

    }, [hospitalization.admissionDate]);

    return (
        <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                <div>

                    <div className="flex items-center gap-3 flex-wrap">

                        <h1 className="text-2xl font-semibold text-slate-800">

                            {hospitalitationData?.patient.fullname}

                        </h1>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium  ${statusStyles.className}`}>
                            {hospitalitationData?.hospitalitation.status}
                        </span>

                    </div>

                </div>

                <div className="flex flex-wrap gap-3">

                    <Button
                        icon={faArrowLeft}
                        label="Volver"
                        color="gray"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    />

                    <Button
                        icon={faArrowRightFromBracket}
                        label="Egresar"
                        color="green"
                        onClick={() =>
                            navigate(
                                `/admin/hospitalizations/${id}/discharge`
                            )
                        }
                    />

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Área
                    </p>

                    <p className="text-lg font-semibold text-slate-700">
                        {hospitalitationData.hospitalArea.name}
                    </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Fecha ingreso
                    </p>

                    <p className="text-lg font-semibold text-slate-700">
                        {hospitalitationData.hospitalitation.startDate}
                    </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Fecha egreso
                    </p>

                    <p className="text-lg font-semibold text-slate-700">
                        {hospitalitationData.hospitalitation.endDate || "-"}
                    </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Días estancia
                    </p>

                    <p className="text-lg font-bold text-blue-700">
                        {stayDays}
                    </p>

                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 space-y-6">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Información de hospitalización
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="md:col-span-2">

                                <p className="text-xs text-slate-400">
                                    Motivo de hospitalización
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalitationData.hospitalitation.motiveIngress}
                                </p>

                            </div>

                            <div className="md:col-span-2">

                                <p className="text-xs text-slate-400">
                                    Motivo de egreso
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalitationData.hospitalitation.motiveIngress}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <h2 className="text-lg font-semibold text-slate-700 mb-5">
                            Observaciones clínicas
                        </h2>

                        <p className="text-slate-700 leading-relaxed">
                            {hospitalization.observations}
                        </p>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                        <div className="flex items-center gap-3 mb-6">

                            <FontAwesomeIcon
                                icon={faClock}
                                className="text-slate-600"
                            />

                            <h2 className="text-lg font-semibold text-slate-700">
                                Historial de movimientos
                            </h2>

                        </div>

                        <div className="space-y-4">

                            {hospitalization.transfers.map(
                                (movement, index) => (

                                    <div
                                        key={index}
                                        className="border border-slate-200 rounded-xl p-5"
                                    >

                                        <div className="flex flex-col md:flex-row md:justify-between gap-3">

                                            <div>

                                                <p className="font-medium text-slate-700">
                                                    {movement.from}
                                                    {" → "}
                                                    {movement.to}
                                                </p>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {movement.reason}
                                                </p>

                                            </div>

                                            <span className="text-xs text-slate-400">
                                                {movement.date}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

                <div className="space-y-5">

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <FontAwesomeIcon
                                icon={faUser}
                                className="text-blue-600"
                            />

                            <h2 className="font-semibold text-slate-700">
                                Información del paciente
                            </h2>

                        </div>

                        <div className="space-y-4">

                            <div>
                                <p className="text-xs text-slate-400">
                                    Expediente
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.patient.expediente}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Edad
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.patient.edad} años
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Género
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.patient.genero}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Teléfono
                                </p>

                                <p className="font-medium text-slate-700">
                                    {hospitalization.patient.telefono}
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                        <div className="flex items-center gap-3 mb-5">

                            <FontAwesomeIcon
                                icon={faUserDoctor}
                                className="text-emerald-600"
                            />

                            <h2 className="font-semibold text-slate-700">
                                Responsable
                            </h2>

                        </div>

                        <p className="font-medium text-slate-700">
                            {hospitalization.doctor}
                        </p>

                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                        <div className="flex items-start gap-3">

                            <FontAwesomeIcon
                                icon={faBuildingUser}
                                className="text-blue-700 mt-1"
                            />

                            <div>

                                <h3 className="font-semibold text-blue-700">
                                    Hospitalización activa
                                </h3>

                                <p className="text-sm text-blue-600 mt-1">
                                    El paciente permanece ingresado y continúa bajo supervisión médica.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default HospitalizationDetailsPage;