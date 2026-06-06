import type { ParentRole } from "./ParentRole";
import type { Permission } from "./Permission";

export type Role = {
  id: number;
  roleName: string;
  parentRole?: ParentRole;
  permissions: Permission[];
};