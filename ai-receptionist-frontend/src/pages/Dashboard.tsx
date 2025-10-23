"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import { api } from "../utils/api";
import AppointmentTable from "../components/AppointmentTable";
import SummaryTable from "../components/SummaryTable";

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

  const fetchBookings = async () => {
    try {
      const data = await api.get("/bookings/");
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/${id}?status=${encodeURIComponent(status)}`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const summaryByDate = useMemo(() => {
    const summary: Record<string, { confirmed: number; pending: number; cancelled: number }> = {};
    bookings.forEach((b) => {
      const dateKey = new Date(b.datetime).toLocaleDateString();
      if (!summary[dateKey]) summary[dateKey] = { confirmed: 0, pending: 0, cancelled: 0 };
      if (b.status.toLowerCase() === "confirmed") summary[dateKey].confirmed++;
      else if (b.status.toLowerCase() === "cancelled") summary[dateKey].cancelled++;
      else summary[dateKey].pending++;
    });
    return summary;
  }, [bookings]);

  return (
    <DashboardLayout>
      <Header title="Appointments Dashboard" />

      {/* Summary Table */}
      <SummaryTable summary={summaryByDate} />

      {/* All Appointments Table */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mt-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">All Appointments</h2>
        <AppointmentTable bookings={bookings} onStatusChange={handleStatusChange} />
      </div>
    </DashboardLayout>
  );
}
