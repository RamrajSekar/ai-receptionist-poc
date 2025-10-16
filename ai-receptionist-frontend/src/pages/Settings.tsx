import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";

export default function Settings() {
  return (
    <DashboardLayout>
      <Header title="Settings" actionLabel="Save Changes" />
      <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">
        Settings configuration will go here.
      </div>
    </DashboardLayout>
  );
}
