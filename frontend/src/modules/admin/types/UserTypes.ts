export type UserRequestParams = {
    id?: number;
    username: string;
    email: string;
    status: boolean;
    roles: number[];
    name: string;
    lastname: string;
    password: string;
}

export type UserRoles = {
    idRol: number;
    nombreRol: string;
}

export type UserForm = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: number[];
};

export type UserTableRow = {
    id: number;
    username: string;
    email: string;
    statusLabel: string;
};