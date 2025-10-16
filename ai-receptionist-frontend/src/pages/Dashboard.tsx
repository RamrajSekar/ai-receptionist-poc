import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentTable from "../components/AppointmentTable";
import CalendarWidget from "../components/CalendarWidget";

export default function Dashboard() {
  const upcoming = [
    { name: "Surya R", date: "14 Mar 2025" },
    { name: "Ramesh Kumar", date: "16 Mar 2025" },
  ];

  const appointments = [
    { first: "Jane", last: "Cooper", phone: "9876543210", date: "13-Aug-2023", status: "open" },
    { first: "Wade", last: "Warren", phone: "9876543210", date: "13-Aug-2023", status: "booked" },
  ];

  return (
    <DashboardLayout>
      <Header title="Dashboard" actionLabel="View Schedule" onAction={() => {}} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
          {upcoming.map((item, i) => (
            <AppointmentCard key={i} name={item.name} date={item.date} />
          ))}
        </div>

        <CalendarWidget month="April" year={2025} activeDates={[23, 24, 25]} />
      </div>

      <AppointmentTable title="All Appointments" data={appointments} />
    </DashboardLayout>
  );
}
