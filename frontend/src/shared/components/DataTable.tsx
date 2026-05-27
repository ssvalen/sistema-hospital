import { useMemo, useState } from "react";
import Button from "./Button";

import { useToast } from "@/shared/hooks/useToast";
import Toast from "@/shared/components/Toast";
import { TOAST_TYPES } from "@/shared/types/ToastType";

import type {
    TableAction,
    TableColumn,
    SortConfig,
} from "@/shared/types/table/TableTypes";

import { TABLE_ICONS } from "@/shared/types/table/TableIcons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// PROPS

interface DataTableProps<T> {
    columns: TableColumn[];
    data: T[];
    actions?: TableAction<T>[];

    defaultSort?: SortConfig;

    page: number;
    pageSize: number;
    total: number;

    onPageChange: (page: number) => void;

    fitContainer?: boolean;
    loading?: boolean;

    onFiltersChange?: (filters: Record<string, string>) => void;

    rowKey?: keyof T;
}


const DataTable = <T extends Record<string, any>>({
    columns,
    data,
    actions = [],
    defaultSort,
    page,
    pageSize,
    total,
    onPageChange,
    fitContainer = false,
    loading = false,
    onFiltersChange,
    rowKey,
}: DataTableProps<T>) => {

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: defaultSort?.key ?? null,
        direction: defaultSort?.direction ?? null,
    });

    const { toast, showToast, hideToast } = useToast();

    const [filters, setFilters] = useState<Record<string, string>>({});

    // =========================
    // COPY
    // =========================

    const copyToClipboard = async (text: unknown) => {
        try {
            await navigator.clipboard.writeText(String(text ?? ""));
            showToast("Copiado al portapapeles", TOAST_TYPES.SUCCESS);
        } catch {
            showToast("No se pudo copiar", TOAST_TYPES.ERROR);
        }
    };

    // =========================
    // SORT
    // =========================

    const handleSort = (colKey: string) => {
        setSortConfig(prev => ({
            key: colKey,
            direction:
                prev.key === colKey && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const getSortIcon = (colKey: string): IconDefinition => {
        if (sortConfig.key !== colKey) return TABLE_ICONS.SORT_DEFAULT;

        return sortConfig.direction === "asc"
            ? TABLE_ICONS.SORT_ASC
            : TABLE_ICONS.SORT_DESC;
    };

    // =========================
    // FILTERS
    // =========================

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange?.(newFilters);
    };

    // =========================
    // DATA
    // =========================

    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                return String(row[key])
                    .toLowerCase()
                    .includes(value.toLowerCase());
            });
        });
    }, [data, filters]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key!];
            const bVal = b[sortConfig.key!];

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (aVal < bVal)
                return sortConfig.direction === "asc" ? -1 : 1;

            if (aVal > bVal)
                return sortConfig.direction === "asc" ? 1 : -1;

            return 0;
        });
    }, [filteredData, sortConfig]);

    // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(total / pageSize);

    const goPrev = () => page > 1 && onPageChange(page - 1);
    const goNext = () => page < totalPages && onPageChange(page + 1);

    // =========================
    // RENDER
    // =========================

    if (!loading && (!data || data.length === 0)) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
                No hay datos disponibles
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${fitContainer ? "h-full" : "h-[calc(100vh-180px)]"}`}>

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={hideToast}
            />

            <table className="w-full text-sm">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable && handleSort(col.key)}
                                className={col.sortable ? "cursor-pointer" : ""}
                            >
                                <div className="flex items-center gap-2">
                                    {col.label}

                                    {col.sortable && (
                                        <FontAwesomeIcon
                                            icon={getSortIcon(col.key)}
                                            className="opacity-60"
                                        />
                                    )}
                                </div>

                                {col.hasInput && (
                                    <input
                                        className="mt-1 w-full border px-2 py-1"
                                        value={filters[col.key] || ""}
                                        onChange={(e) =>
                                            handleFilterChange(col.key, e.target.value)
                                        }
                                    />
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {sortedData.map((row, idx) => (
                        <tr key={rowKey ? String(row[rowKey]) : idx}>
                            {columns.map(col => (
                                <td key={col.key}>
                                    {col.hasActions ? (
                                        <div className="flex gap-2 justify-center">
                                            {actions.map(action => (
                                                <Button
                                                    key={action.title}
                                                    icon={action.icon}
                                                    label={action.label}
                                                    title={action.title}
                                                    color={action.color}
                                                    onClick={() => action.onClick(row)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <span
                                            onClick={() =>
                                                copyToClipboard(row[col.key])
                                            }
                                        >
                                            {row[col.key] ?? "N/A"}
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between p-4">
                <button onClick={goPrev} disabled={page === 1}>
                    Anterior
                </button>

                <button onClick={goNext} disabled={page === totalPages}>
                    Siguiente
                </button>
            </div>

        </div>
    );
};

export default DataTable;