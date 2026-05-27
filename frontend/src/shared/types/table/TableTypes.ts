import type { ButtonColor } from "../button/ButtonTypes";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
    key: string | null;
    direction: SortDirection;
}

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    hasInput?: boolean;
    hasActions?: boolean;
    inputType?: string;
}

export interface TableAction<T> {
    title: string;
    label?: string;
    icon?: IconDefinition;
    color?: ButtonColor;
    onClick: (row: T) => void;
}