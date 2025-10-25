"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import { api } from "../utils/api";
import AppointmentTable from "../components/AppointmentTable";
import SummaryTable from "../components/SummaryTable";
import TodayAppointmentsTable from "../components/TodayAppointmentsTable";

interface Booking {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  status: string;
  intent: string;
  transcript: string;
  stage: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const data = await api.get("/bookings/");
      setBookings(
        data.sort(
          (a: Booking, b: Booking) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  // Update status instantly
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/${id}?status=${encodeURIComponent(status)}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <DashboardLayout>
      <Header title="Appointments Dashboard" />

      {/* Top Row: Summary + Today’s Appointments aligned perfectly */}
      <div
  className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 mt-6 items-stretch"
>
  <SummaryTable bookings={bookings} />
  <TodayAppointmentsTable
    bookings={bookings}
    onStatusChange={handleStatusChange}
  />
</div>


      {/* All Appointments List */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mt-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          All Appointments
        </h2>
        <AppointmentTable
          bookings={bookings}
          onStatusChange={handleStatusChange}
        />
      </div>
    </DashboardLayout>
  );
}
