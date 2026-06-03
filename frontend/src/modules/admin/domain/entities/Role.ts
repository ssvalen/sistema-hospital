import type { ParentRole } from "./ParentRole";

export type Role = {
  id: number;
  roleName: string;
  parentRole: ParentRole;
  permissions: string[];
};