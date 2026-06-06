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

import { useHospitalizationsByPatient } from "../../hooks/hospitalitation/useHospitalizationsByPatient";
import type { Hospitalitation } from "../../domain/entities/Hospitalitation";


type HospitalizationHistoryProps = {
    idHospitalization: number;
    permission?: string;
}

const HospitalizationHistory = ({
    idHospitalization,
    permission
}: HospitalizationHistoryProps) => {

    const navigate = useNavigate();

    const { data: hospitalizationHistoryData } = useHospitalizationsByPatient(idHospitalization)


    return (

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

                <FontAwesomeIcon
                    icon={faClock}
                    className="text-slate-600"
                />

                <h2 className="text-lg font-semibold text-slate-700">
                    Historial de hospitalizaciones
                </h2>

            </div>
            {!hospitalizationHistoryData ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-500">
                    <p>No hay historial de hospitalizaciones</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {hospitalizationHistoryData.map((movement: Hospitalitation) => (
                        <div
                            key={movement.id}
                            className="relative border border-slate-200 rounded-xl bg-white p-6 shadow-sm"
                        >
                            <div className="flex gap-4">

                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-slate-800">
                                                {movement.hospitalitation.status}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {movement.hospitalArea.name}
                                            </p>
                                        </div>

                                        <span
                                            className={`text-xs px-3 py-1 rounded-full ${movement.status
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {movement.status ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-slate-400 text-xs">Motivo de ingreso</p>
                                            <p className="text-slate-700">{movement.hospitalitation.motiveIngress}</p>
                                        </div>

                                        {movement.hospitalitation.motiveEgress && (
                                            <div className="space-y-1">
                                                <p className="text-slate-400 text-xs">Motivo de egreso</p>
                                                <p className="text-slate-700">
                                                    {movement.hospitalitation.motiveEgress}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col md:flex-row md:justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                                        <p>Ingreso: {movement.hospitalitation.startDate}</p>
                                        {movement.hospitalitation.endDate && (
                                            <p>Egreso: {movement.hospitalitation.endDate}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>

    );
};

export default HospitalizationHistory;