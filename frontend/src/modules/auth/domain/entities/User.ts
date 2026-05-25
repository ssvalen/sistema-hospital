
export type User = {
  id: number;
  username: string;
  role: "admin" | "doctor" | "nurse";
  token: string;
};
