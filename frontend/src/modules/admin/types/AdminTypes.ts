export type CreateRoleParams = {
    roleId: number;
    roleName: string;
    parentRoleId: number;
    permissions: number[];
};