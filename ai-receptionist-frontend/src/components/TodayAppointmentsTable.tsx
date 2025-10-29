"use client";

import { useMemo, useState } from "react";
import Modal from "./Modal";

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

  //  Filter only today's confirmed or completed bookings
  const todayAppointments = useMemo(() => {
    const todayKey = new Date().toLocaleDateString();
    return bookings.filter((b) => {
      const dateMatch =
        new Date(b.datetime).toLocaleDateString() === todayKey;
      const status = b.status.toLowerCase();
      return dateMatch && (status === "confirmed" || status === "completed");
    });
  }, [bookings]);

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        Today's Appointments
      </h2>

      {todayAppointments.length === 0 ? (
        <p className="text-gray-500 text-center py-4 italic flex-1">
          No appointments for today.
        </p>
      ) : (
        <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 flex-1">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Date & Time</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map((b) => {
                const isCompleted = b.status.toLowerCase() === "completed";
                const isConfirmed = b.status.toLowerCase() === "confirmed";

                return (
                  <tr
                    key={b.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{b.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(b.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold capitalize ${
                        isCompleted ? "text-green-700" : "text-yellow-600"
                      }`}
                    >
                      {b.status}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        {isConfirmed && (
                          <button
                            onClick={() => onStatusChange(b.id, "Completed")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition text-sm"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(b)}
                          className="bg-[#003D4D] hover:bg-[#005f66] text-white px-3 py-1 rounded-lg transition text-sm"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
