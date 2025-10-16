import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";

export default function ManageAppointments() {
  return (
    <DashboardLayout>
      <Header title="Manage Appointments" actionLabel="Add Appointment" />
      <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">
        Appointment management features will go here.
      </div>
    </DashboardLayout>
  );
}
