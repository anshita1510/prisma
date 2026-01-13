import Sidebar from "./_components/sidebar_u"
import Banner from "./_components/Banner"
import LeaveStatusWidget from "./_components/LeaveStatusWidget"

export default function page() {
  return (
    <div className="flex min-h-screen">
    {/* Sidebar */}
    <Sidebar />
    

    {/* Main Content */}
    <main className="flex-1 ">
      <Banner></Banner>
      <LeaveStatusWidget />
    </main>
  </div>
  )
}