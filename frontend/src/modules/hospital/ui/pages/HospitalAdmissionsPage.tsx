import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button, { BUTTON_COLORS } from "@/shared/components/forms/Button";
import Input from "@/shared/components/forms/Input";
import Select from "@/shared/components/forms/Select";
import FormField from "@/shared/components/forms/FormField";

import CanAccess from "@/shared/components/permissions/CanAccess";
import { PERMISSIONS } from "@/shared/utils/permissions";

// import type { Permission } from "@/modules/admin/domain/entities/Permission";
import type { TableAction } from "@/shared/types/table/TableTypes";

import {
    faPlus,
    faArrowRightFromBracket,
    faBed,
    faArrowRightArrowLeft,
    faEye
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "@/shared/components/DataTable";

type Admission = {
    id: number;
    expediente: string;
    paciente: string;
    area: string;
    fechaIngreso: string;
    fechaEgreso?: string;
    medico: string;
    estado: "HOSPITALIZADO" | "EGRESADO";
};

const HospitalAdmissionsPage = () => {

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalElements = 2


    const openAdmissionDetail = (admission: Admission) => {
        navigate(`admission/${admission.id}/detail`)
    }

    const openEgressForm = (admission: Admission) => {
        navigate(`admission/${admission.id}/discharge`)
    }

    const actions: TableAction<Admission>[] = [
        {
            title: "Ver detalles de admisión",
            label: "Ver",
            icon: faEye,
            color: BUTTON_COLORS.BLUE,
            permission: PERMISSIONS.HOSPITAL.VIEW_ADMISSION_DETAIL,
            onClick: openAdmissionDetail,
        },
        {
            title: "Egresar paciente",
            label: "Egreso",
            icon: faArrowRightFromBracket,
            color: BUTTON_COLORS.GREEN,
            permission: PERMISSIONS.HOSPITAL.EGRESS_PATIENT,
            onClick: openEgressForm
        }
    ];




    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const admissions: Admission[] = [
        {
            id: 1,
            expediente: "EXP-000123",
            paciente: "Juan Pérez",
            area: "Medicina Interna",
            fechaIngreso: "2026-06-01",
            medico: "Dr. Carlos López",
            estado: "HOSPITALIZADO"
        },
        {
            id: 2,
            expediente: "EXP-000124",
            paciente: "Ana García",
            area: "Cirugía",
            fechaIngreso: "2026-05-28",
            fechaEgreso: "2026-06-01",
            medico: "Dr. Roberto Méndez",
            estado: "EGRESADO"
        }
    ];

    const filteredAdmissions = useMemo(() => {
        return admissions.filter((item) => {

            const matchesSearch =
                item.paciente
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.expediente
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesArea =
                areaFilter === "all"
                    ? true
                    : item.area === areaFilter;

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : item.estado === statusFilter;

            return (
                matchesSearch &&
                matchesArea &&
                matchesStatus
            );
        });
    }, [
        admissions,
        search,
        areaFilter,
        statusFilter
    ]);

    const totalHospitalizados =
        admissions.filter(
            (x) => x.estado === "HOSPITALIZADO"
        ).length;

    const totalEgresados =
        admissions.filter(
            (x) => x.estado === "EGRESADO"
        ).length;

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
                        Hospitalizados
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
                        {admissions.length}
                    </p>

                </div>

            </div>

            <div className="py-6">
                <DataTable<Admission>
                    columns={[
                        { key: "paciente", label: "Nombre paciente", sortable: true, hasInput: true },
                        { key: "medico", label: "Médico", sortable: true, hasInput: true },
                        { key: "area", label: "Área", sortable: true, hasInput: true },
                        { key: "fechaIngreso", label: "Ingreso", sortable: true, hasInput: true , inputType: "date"},
                        { key: "fechaEgreso", label: "Egreso", sortable: true, hasInput: true, inputType: "date"},
                        { key: "actions", label: "Acciones", hasActions: true },
                    ]}
                    loading={false}
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