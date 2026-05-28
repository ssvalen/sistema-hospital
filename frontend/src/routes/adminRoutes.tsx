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
import PatientsPage from "@/modules/patients/ui/pages/PatientsPage";
import CreatePatientPage from "@/modules/patients/ui/pages/PatientFormPage";
import PatientDetailsPage from "@/modules/patients/ui/pages/PatientDetailsPage";
import PatientFormPage from "@/modules/patients/ui/pages/PatientFormPage";
import AppointmentFormPage from "@/modules/appointments/ui/pages/AppointmentFormPage";
import AppointmentCalendarPage from "@/modules/appointments/ui/pages/AppointmentCalendarPage";
import AppointmentDetailsPage from "@/modules/appointments/ui/pages/AppointmentDetailsPage";

const DummyPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">{title}</h1>
  </div>
);

const DashboardPage = () => <DummyPage title="Dashboard" />;

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
        path: "patients/create",
        element: CreatePatientPage,
        label: "Crear paciente",
        showInSidebar: false,
        permissions: ["patients.view"],
      },
      {
        path: "patients/:id/edit",
        element: PatientFormPage,
        label: "Editar paciente",
        showInSidebar: false,
        // permissions: ["patients.edit"],
      },

      {
        path: "patients/:id",
        element: PatientDetailsPage,
        label: "Detalle paciente",
        showInSidebar: false,
        permissions: ["patients.view"],
      },
      // Citas
      {
        path: "appointments",
        element: AppointmentCalendarPage,
        label: "Citas médicas",
        permissions: ["appointments.view"],
      },
      {
        path: "appointments/new",
        element: AppointmentFormPage,
        showInSidebar: false,
      },

      {
        path: "appointments/:id",
        element: AppointmentDetailsPage,
        showInSidebar: false,
      },

      {
        path: "appointments/:id/edit",
        element: AppointmentFormPage,
        showInSidebar: false,
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