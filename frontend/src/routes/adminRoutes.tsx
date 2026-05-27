import {
  faChartLine,
  faUsers,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import type { SidebarRoute } from "@/shared/types/sidebarRoute";

import RolesPages from "@/modules/admin/ui/pages/RolesPages";
import RoleFormPage from "@/modules/admin/ui/pages/RoleFormPage";
import PermissionsPage from "@/modules/admin/ui/pages/PermissionsPage";
import UsersPage from "@/modules/admin/ui/pages/UsersPage";

const DummyPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">{title}</h1>
  </div>
);

const DashboardPage = () => <DummyPage title="Dashboard" />;
const PatientsPage = () => <DummyPage title="Pacientes" />;
const AppointmentsPage = () => <DummyPage title="Citas" />;
const MedicalRecordsPage = () => <DummyPage title="Expedientes" />;
const ReportsPage = () => <DummyPage title="Reportes" />;

export const adminRoutes: SidebarRoute[] = [
  {
    path: "",
    element: DashboardPage,
    label: "Dashboard",
    icon: faChartLine,
    permissions: [],
    showInSidebar: true,
  },
  {
    label: "Gestión Médica",
    icon: faUsers,
    showInSidebar: true,
    children: [
      {
        path: "patients",
        element: PatientsPage,
        label: "Pacientes",
        permissions: ["patients.view"],
      },
      {
        path: "appointments",
        element: AppointmentsPage,
        label: "Citas",
        permissions: ["appointments.view"],
      },
      {
        path: "medical-records",
        element: MedicalRecordsPage,
        label: "Expedientes",
        permissions: ["records.view"],
      },
    ],
  },
  {
    label: "Administración",
    icon: faFileLines,
    showInSidebar: true,
    permissions: ["admin.manager"],
    children: [
      {
        path: "roles",
        element: RolesPages,
        label: "Roles",
        permissions: ["admin.manager.roles"],
      },
      {
        path: "roles/new",
        element: RoleFormPage,
        label: "Crear Rol",
        permissions: ["admin.manager.roles"],
        showInSidebar: false,
      },
      {
        path: "roles/:id",
        element: RoleFormPage,
        label: "Editar Rol",
        permissions: ["admin.manager.roles"],
        showInSidebar: false,
      },

      {
        path: "permissions",
        element: PermissionsPage,
        label: "Permisos",
        showInSidebar: true,
        permissions: ["admin.manager.roles"],
      },

      {
        path: "users",
        element: UsersPage,
        label: "Usuarios",
        permissions: ["reports.view"],
      },
    ],
  },
];