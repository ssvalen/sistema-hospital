import React from "react";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ButtonColor } from "@/shared/types/button/ButtonTypes";

export const BUTTON_COLORS = {
    GREEN: "green",
    BLUE: "blue",
    RED: "red",
} as const;

interface ColorConfig {
    bg: string;
    hover: string;
    text: string;
}

interface ButtonProps {
    icon?: IconDefinition;
    label?: string;
    title?: string;
    color?: ButtonColor;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
}

const colorMap: Record<ButtonColor, ColorConfig> = {
    green: {
        bg: "bg-green-100",
        hover: "hover:bg-green-500",
        text: "text-green-600",
    },
    blue: {
        bg: "bg-blue-100",
        hover: "hover:bg-blue-500",
        text: "text-blue-600",
    },
    red: {
        bg: "bg-red-100",
        hover: "hover:bg-red-500",
        text: "text-red-600",
    },
};

const Button: React.FC<ButtonProps> = ({
    icon,
    label,
    title,
    color = "blue",
    onClick,
    type = "button",
    disabled = false,
    className = "",
}) => {
    const c = colorMap[color];

    return (
        <button
            type={type}
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`
                p-2 rounded-lg shadow-sm
                hover:shadow-md transition-all
                active:scale-95 flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${c.bg}
                ${c.hover}
                ${c.text}
                ${className}
            `}
        >
            {icon && <FontAwesomeIcon icon={icon as any} />}
            {label && <span>{label}</span>}
        </button>
    );
};

export default Button;