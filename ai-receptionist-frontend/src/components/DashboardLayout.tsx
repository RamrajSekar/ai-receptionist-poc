import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-[#F6FAFB] text-[#1E2D2F]">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
