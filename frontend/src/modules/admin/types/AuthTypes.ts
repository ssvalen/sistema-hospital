export interface User {
    id: string;
    name: string;
    email: string;
    active: boolean;
    roles: Role[];
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: Permission[];
}

export interface Permission {
    id: string;
    name: string;
    code: string; 
}