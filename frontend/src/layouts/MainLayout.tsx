import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-4">
        Sistema Hospitalario
      </header>

      {/* Contenido */}
      <main className="p-4">{children}</main>
    </div>
  );
}