import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: any) {


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
