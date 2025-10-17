"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import AppointmentTable from "../components/AppointmentTable";
import { api } from "../utils/api";

interface Booking {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  status: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch all appointments
  const fetchBookings = async () => {
    try {
      const data = await api.get("/bookings/");
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  // Update appointment status
  const handleStatusChange = async (id: string, status: string) => {
  try {
    await api.put(`/bookings/${id}?status=${encodeURIComponent(status)}`);
    fetchBookings(); // refresh after update
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};



  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <DashboardLayout>
      <Header title="Appointments Dashboard" actionLabel="" onAction={() => {}} />

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">All Appointments</h2>
        <AppointmentTable
          bookings={bookings}
          onStatusChange={handleStatusChange}
          
        />
      </div>
    </DashboardLayout>
  );
}
