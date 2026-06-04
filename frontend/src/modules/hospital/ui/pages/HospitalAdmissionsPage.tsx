import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import CanAccess from "@/shared/components/permissions/CanAccess";

import type { TableAction } from "@/shared/types/table/TableTypes";

import {
    faPlus,
    faArrowRightFromBracket,
    faEye
} from "@fortawesome/free-solid-svg-icons";

import DataTable from "@/shared/components/DataTable";

import { PERMISSIONS } from "@/shared/utils/permissions";

import type { Hospitalitation } from "../../domain/entities/Hospitalitation";
import { useHospitalitations } from "../../hooks/hospitalitation/useHospitalitations";

import { canExecuteHospitalitationAction } from "../utils/canExecuteHospitalitationAction.ts";
import { HOSPITALITATION_ACTIONS } from "../../types/HospitalitationActions";
import type { HospitalitationStatus } from "../../types/HospitalitationStatus";
const HospitalAdmissionsPage = () => {

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const {
        data: admissions = [],
        isLoading
    } = useHospitalitations();

    const totalElements = admissions.length;

    const totalHospitalizados =
        admissions.filter(
            (x) =>
                x.hospitalitation.status === "INTERNADO"
        ).length;

    const totalEgresados =
        admissions.filter(
            (x) =>
                x.hospitalitation.status === "EGRESADO"
        ).length;

    const openAdmissionDetail = (
        admission: Hospitalitation
    ) => {
        navigate(
            `admission/${admission.id}/detail`
        );
    };

    const openEgressForm = (
        admission: Hospitalitation
    ) => {
        navigate(
            `admission/${admission.id}/discharge`
        );
    };

    const actions: TableAction<Hospitalitation>[] = [
        {
            title: "Ver detalles de admisión",
            label: "Ver",
            icon: faEye,
            color: BUTTON_COLORS.BLUE,
            permission:
                PERMISSIONS.HOSPITAL.VIEW_ADMISSION_DETAIL,
            onClick: openAdmissionDetail,
        },
        {
            title: "Egresar paciente",
            label: "Egreso",
            icon: faArrowRightFromBracket,
            color: BUTTON_COLORS.GREEN,
            permission:
                PERMISSIONS.HOSPITAL.EGRESS_PATIENT,
            onClick: openEgressForm,
            visible: (row) =>
                canExecuteHospitalitationAction(
                    row.hospitalitation.status as HospitalitationStatus,
                    HOSPITALITATION_ACTIONS.DISCHARGE
                )
        }
    ];

    return (
        <div className="p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Ingresos Hospitalarios
                    </h1>

                    <p className="text-sm text-slate-500">
                        Control de ingresos y egresos de pacientes por área
                    </p>
                </div>

                <div className="flex gap-3">

                    <CanAccess permission={PERMISSIONS.HOSPITAL.CREATE_ADMISION}>
                        <Button
                            icon={faPlus}
                            label="Nuevo ingreso"
                            color="blue"
                            onClick={() =>
                                navigate(
                                    "admission/new"
                                )
                            }
                        />
                    </CanAccess>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Internados
                    </p>

                    <p className="text-3xl font-bold text-blue-700">
                        {totalHospitalizados}
                    </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Egresados
                    </p>

                    <p className="text-3xl font-bold text-emerald-700">
                        {totalEgresados}
                    </p>

                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                    <p className="text-sm text-slate-400">
                        Total registros
                    </p>

                    <p className="text-3xl font-bold text-slate-700">
                        {totalElements}
                    </p>

                </div>

            </div>

            <div className="py-6">
                <DataTable<Hospitalitation>
                    columns={[
                        {
                            key: "patient.fullname",
                            label: "Paciente",
                            sortable: true,
                            hasInput: true
                        },
                        {
                            key: "hospitalArea.name",
                            label: "Área",
                            sortable: true,
                            hasInput: true
                        },
                        {
                            key: "hospitalitation.startDate",
                            label: "Ingreso",
                            sortable: true,
                            hasInput: true,
                            inputType: "date"
                        },
                        {
                            key: "hospitalitation.endDate",
                            label: "Egreso",
                            sortable: true,
                            hasInput: true,
                            inputType: "date"
                        },
                        {
                            key: "hospitalitation.status",
                            label: "Estado",
                            sortable: true,
                            hasInput: true
                        },
                        {
                            key: "actions",
                            label: "Acciones",
                            hasActions: true
                        }
                    ]}
                    loading={isLoading}
                    data={admissions}
                    page={page}
                    pageSize={pageSize}
                    total={totalElements}
                    onPageChange={setPage}
                    actions={actions}
                />
            </div>

        </div>
    );
};

export default HospitalAdmissionsPage;