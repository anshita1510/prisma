import Sidebar from "../_components/Sidebarr";
import CreateUserSuperAdmin from "../_components/CreateUserSuperAdmin";

export default function CreateUserPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 bg-gray-50">
        <CreateUserSuperAdmin />
      </main>
    </div>
  );
}
