import { useState } from "react";

import DataTable from "@/shared/components/DataTable";
import Modal from "@/shared/components/Modal";

import {
    faDatabase,
    faEye
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { TableColumn, TableAction } from "@/shared/types/table/TableTypes";
import { usePaginatedAuditLogs } from "../../hooks/usePaginatedAuditLogs";
import type { AuditLog } from "../../domain/entities/AuditLog";

const AuditLogsPage = () => {

    const [page, setPage] = useState(1);
    const pageSize = 10;



    const {
        items: auditLogs,
        totalElements,
        isLoading,
        isFetching
    } = usePaginatedAuditLogs(page - 1, pageSize)

    const [selectedLog, setSelectedLog] = useState<any | null>(null);
    const [open, setOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"before" | "after">("after");

    const data = Array.from({ length: 10 }).map((_, i) => ({
        id: `${page}-${i}`,
        timestamp: new Date().toISOString(),
        action: ["CREATE", "UPDATE", "DELETE"][i % 3],
        entityType: "PATIENT",
        entityId: `ID-${page}-${i}`,
        user: {
            username: `user_${i}`
        },
        change: {
            before: { name: "Old Name", age: 20 },
            after: { name: "New Name", age: 25 }
        }
    }));

    const getActionStyle = (action: string) => {
        switch (action) {
            case "CREATE":
                return "bg-emerald-100 text-emerald-700";
            case "UPDATE":
                return "bg-amber-100 text-amber-700";
            case "DELETE":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const columns: TableColumn[] = [
        {
            key: "timestamp",
            label: "Fecha",
            sortable: true,
            hasInput: true,
            inputType: "date"
        },
        {
            key: "user.username",
            label: "Usuario",
            sortable: true,
            hasInput: true
        },
        {
            key: "action",
            label: "Acción",
            sortable: true,
            hasInput: true
        },
        {
            key: "entityType",
            label: "Entidad",
            sortable: true,
            hasInput: true
        },
        {
            key: "entityId",
            label: "ID",
            hasInput: true
        },
        {
            key: "acciones",
            label: "Acciones",
            hasActions: true
        }
    ];

    const actions: TableAction<AuditLog>[] = [
        {
            label: "Ver",
            title: "Ver detalle",
            icon: faEye,
            color: "blue",
            onClick: (row) => {
                setSelectedLog(row);
                setViewMode("after");
                setOpen(true);
            }
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

                <div className="max-w-7xl mx-auto space-y-8">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faDatabase} className="text-white text-xl" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Auditoría del sistema
                            </h1>

                            <p className="text-slate-500">
                                Monitoreo de acciones del sistema
                            </p>
                        </div>

                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faDatabase}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-800">
                                    Logs de auditoría
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Historial de acciones
                                </p>
                            </div>

                        </div>

                        <div className="p-6">
                            <DataTable<AuditLog>
                                columns={columns}
                                loading={isLoading || isFetching}
                                data={auditLogs}
                                page={page}
                                pageSize={pageSize}
                                total={totalElements}
                                onPageChange={setPage}
                                actions={actions}
                            />
                            {/* <DataTable
                                columns={columns}
                                data={data}
                                actions={actions}
                                page={page}
                                pageSize={10}
                                total={42}
                                onPageChange={setPage}
                                rowKey="id"
                            /> */}

                        </div>

                    </div>

                </div>

            </div>

            <Modal
                abierto={open}
                onClose={() => setOpen(false)}
                titulo="Detalle del log"
                size="lg"
            >
                {selectedLog && (

                    <div className="space-y-6">

                        <div className="flex justify-between border-b pb-3">

                            <div>
                                <p className="text-xs text-slate-400">Acción</p>

                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getActionStyle(selectedLog.action)}`}>
                                    {selectedLog.action}
                                </span>
                            </div>

                            <span className="text-xs text-slate-500">
                                {new Date(selectedLog.timestamp).toLocaleString()}
                            </span>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-400">Usuario</p>
                                <p className="font-medium text-slate-700">
                                    {selectedLog.user.username}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-400">Entidad</p>
                                <p className="font-medium text-slate-700">
                                    {selectedLog.entityType}
                                </p>
                            </div>

                        </div>

                        <div className="space-y-4">

                            <div className="flex gap-2">

                                <button
                                    onClick={() => setViewMode("before")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${viewMode === "before"
                                        ? "bg-rose-100 text-rose-700 border-rose-200"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Antes
                                </button>

                                <button
                                    onClick={() => setViewMode("after")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${viewMode === "after"
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Después
                                </button>

                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

                                <p className="text-xs font-semibold text-slate-600 mb-2">
                                    {viewMode === "before"
                                        ? "Estado anterior"
                                        : "Estado actual"}
                                </p>

                                <div className="max-h-80 overflow-auto bg-white p-3 rounded-lg border text-xs text-slate-700">

                                    <pre>
                                        {JSON.stringify(
                                            viewMode === "before"
                                                ? selectedLog.change.before
                                                : selectedLog.change.after,
                                            null,
                                            2
                                        )}
                                    </pre>

                                </div>

                            </div>

                        </div>

                    </div>

                )}
            </Modal>

        </>
    );
};

export default AuditLogsPage;