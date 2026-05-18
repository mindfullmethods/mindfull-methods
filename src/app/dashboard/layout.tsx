import Sidebar from "@/components/components/dashboard/Sidebar";
import Topbar from "@/components/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-gray-50 dark:bg-black">
      
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}