"use client";

import { useMemo, useState } from "react";
import Modal from "./Modal";
import { Eye, CheckCircle2 } from "lucide-react";

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

interface TodayAppointmentsTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
}

export default function TodayAppointmentsTable({
  bookings,
  onStatusChange,
}: TodayAppointmentsTableProps) {
  const [selected, setSelected] = useState<Booking | null>(null);

  const todayConfirmed = useMemo(() => {
    const todayKey = new Date().toLocaleDateString();
    return bookings.filter(
      (b) =>
        new Date(b.datetime).toLocaleDateString() === todayKey &&
        b.status.toLowerCase() === "confirmed"
    );
  }, [bookings]);

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        Appointments for Today
      </h2>

      {todayConfirmed.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No appointments today.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Date & Time</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todayConfirmed.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{b.name}</td>
                <td className="px-4 py-2">{b.phone}</td>
                <td className="px-4 py-2">{new Date(b.datetime).toLocaleString()}</td>
                <td className="px-4 py-2 capitalize text-green-700 font-semibold">
                  {b.status}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onStatusChange(b.id, "Completed")}
                      className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg transition"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </button>
                    <button
                      onClick={() => setSelected(b)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Appointment Details"
      >
        {selected && (
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Date & Time:</strong> {new Date(selected.datetime).toLocaleString()}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Intent:</strong> {selected.intent || "N/A"}</p>
            <p><strong>Stage:</strong> {selected.stage || "N/A"}</p>
            <p><strong>Transcript:</strong> {selected.transcript || "No transcript available."}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
