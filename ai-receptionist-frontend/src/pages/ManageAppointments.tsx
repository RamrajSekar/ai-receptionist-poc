import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import AppointmentTable from "../components/AppointmentTable";
export default function ManageAppointments() {

    const appointments = [
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
    
  ];


  return (
    <DashboardLayout>
      <Header title="Manage Appointments" actionLabel="Add Appointment" />
      <div>
        <AppointmentTable title="All Appointments" data={appointments} />
      </div>
    </DashboardLayout>
  );
}
