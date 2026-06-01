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

import { PERMISSIONS } from "@/shared/utils/permissions";


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
        permissions: [PERMISSIONS.PATIENT.MODULE_ACCESS],
      },
      {
        path: "patients/create",
        element: CreatePatientPage,
        label: "Crear paciente",
        showInSidebar: false,
        permissions: [PERMISSIONS.PATIENT.CREATE],
      },
      {
        path: "patients/:id/edit",
        element: PatientFormPage,
        label: "Editar paciente",
        showInSidebar: false,
        permissions: [PERMISSIONS.PATIENT.EDIT],
      },

      {
        path: "patients/:id",
        element: PatientDetailsPage,
        label: "Detalle paciente",
        showInSidebar: false,
        permissions: [PERMISSIONS.PATIENT.VIEW_DETAIL],
      },
      // Citas
      {
        path: "appointments",
        element: AppointmentCalendarPage,
        label: "Citas médicas",
        permissions: [PERMISSIONS.APPOINTMENT.MODULE_ACCESS],
      },
      {
        path: "appointments/new",
        element: AppointmentFormPage,
        showInSidebar: false,
        permissions: [PERMISSIONS.APPOINTMENT.CREATE],
      },

      {
        path: "appointments/:id",
        element: AppointmentDetailsPage,
        showInSidebar: false,
        permissions: [PERMISSIONS.APPOINTMENT.VIEW_DETAIL],
      },

      {
        path: "appointments/:id/edit",
        element: AppointmentFormPage,
        showInSidebar: false,
        permissions: [PERMISSIONS.APPOINTMENT.EDIT],
      },
    ],
  },
  {
    label: "Administración",
    icon: faFileLines,
    showInSidebar: true,
    permissions: [PERMISSIONS.ADMIN.MODULE_ACCESS],
    children: [
      {
        path: "roles",
        element: RolesPages,
        label: "Roles",
        permissions: [PERMISSIONS.ADMIN.ROLES],
      },
      {
        path: "roles/new",
        element: RoleFormPage,
        label: "Crear Rol",
        permissions: [PERMISSIONS.ADMIN.ROLES_CREATE],
        showInSidebar: false,
      },
      {
        path: "roles/:id",
        element: RoleFormPage,
        label: "Editar Rol",
        permissions: [PERMISSIONS.ADMIN.ROLES_EDIT],
        showInSidebar: false,
      },

      {
        path: "permissions",
        element: PermissionsPage,
        label: "Permisos",
        showInSidebar: true,
        permissions: [PERMISSIONS.ADMIN.PERMISSIONS],
      },

      {
        path: "users",
        element: UsersPage,
        label: "Usuarios",
        permissions: [PERMISSIONS.ADMIN.USERS],
      },
    ],
  },
];