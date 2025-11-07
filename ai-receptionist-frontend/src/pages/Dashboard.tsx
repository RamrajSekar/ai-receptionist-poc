"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import { api } from "../utils/api";
import AppointmentTable from "../components/AppointmentTable";
import SummaryTable from "../components/SummaryTable";
import TodayAppointmentsTable from "../components/TodayAppointmentsTable";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL only once
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Save token for future API requests
      localStorage.setItem("token", token);

      // Remove token from URL without reloading
      window.history.replaceState({}, "", "/dashboard");
    }

    // Ensure token exists before fetching anything
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      console.warn("No token found, redirecting to login.");
      navigate("/");
    } else {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get("/bookings/secure");
      setBookings(
        data.sort(
          (a: Booking, b: Booking) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        )
      );
    } catch (err: any) {
      console.error("Failed to load bookings:", err);
      setError("Failed to fetch bookings. Please check your login.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/secure/${id}?status=${encodeURIComponent(status)}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <DashboardLayout>
      <Header title="Appointments Dashboard" />

      {loading && (
        <div className="text-center text-gray-600 mt-10">Loading data...</div>
      )}
      {error && (
        <div className="text-center text-red-600 mt-10">{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Top Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 mt-6 items-stretch">
            <SummaryTable bookings={bookings} />
            <TodayAppointmentsTable
              bookings={bookings}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* All Appointments */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mt-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              All Appointments
            </h2>
            <AppointmentTable
              bookings={bookings}
              onStatusChange={handleStatusChange}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
