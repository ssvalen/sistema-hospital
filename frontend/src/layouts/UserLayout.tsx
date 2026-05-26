import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <nav className="border-b p-4">
        Navbar Usuario
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;