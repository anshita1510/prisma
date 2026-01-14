import Sidebar from "../_components/Sidebarr";
import Create from "../../admin/_components/createu"

export default function page() {
  return (
   
    <div className="flex min-h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <main className="flex-1 ">
     <Create></Create>
    </main>

  </div>
  )
}
