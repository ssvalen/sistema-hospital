import {
  faChartLine,
  faUsers,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import type { SidebarRoute } from "@/shared/types/sidebarRoute";

const DummyPage = ({
  title,
}: {
  title: string;
}) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>
    </div>
  );
};

export const adminRoutes: SidebarRoute[] = [
  {
    path: "/admin",
    element: () => (
      <DummyPage title="Dashboard" />
    ),
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
        path: "/admin/patients",
        element: () => (
          <DummyPage title="Pacientes" />
        ),
        label: "Pacientes",
        permissions: [
          "patients.view",
        ],
      },
      {
        path: "/admin/appointments",
        element: () => (
          <DummyPage title="Citas" />
        ),
        label: "Citas",
        permissions: [
          "appointments.view",
        ],
      },
      {
        path: "/admin/medical-records",
        element: () => (
          <DummyPage title="Expedientes" />
        ),
        label: "Expedientes",
        permissions: [
          "records.view",
        ],
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
        path: "/admin/roles",
        element: () => (
          <DummyPage title="Usuarios" />
        ),
        label: "Roles",
        permissions: [
          "admin.manager.roles",
        ],
      },

      {
        path: "/admin/reports",
        element: () => (
          <DummyPage title="Reportes" />
        ),
        label: "Reportes",
        permissions: [
          "reports.view",
        ],
      },
    ],
  },
];