"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
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

interface Props {
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
}

export default function AppointmentTable({ bookings, onStatusChange }: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const da = new Date(a.datetime).getTime();
      const db = new Date(b.datetime).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });
  }, [bookings, sortOrder]);

  const handleSortToggle = () => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    await onStatusChange(id, status);
    setUpdatingId(null);
  };

  const getStatusPill = (status: string) => {
    let color = "";
    if (status.toLowerCase() === "confirmed") color = "green";
    else if (status.toLowerCase() === "pending now") color = "yellow";
    else color = "red";
    return (
      <span
        className={`bg-${color}-100 text-${color}-700 px-2 py-1 rounded-full text-sm font-semibold`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Phone</th>
              <th
                className="py-3 px-4 border-b text-left cursor-pointer select-none flex items-center gap-1"
                onClick={handleSortToggle}
              >
                Date & Time
                <ArrowUpDown size={16} className="text-gray-500 ml-1" />
              </th>
              <th className="py-3 px-4 border-b text-left">Status</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4 border-b">{b.name}</td>
                <td className="py-2 px-4 border-b">{b.phone}</td>
                <td className="py-2 px-4 border-b">{new Date(b.datetime).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{getStatusPill(b.status)}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button
                    className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ${
                      updatingId === b.id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={updatingId === b.id}
                    onClick={() => handleStatusUpdate(b.id, "Confirmed")}
                  >
                    Confirm
                  </button>
                  <button
                    className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ${
                      updatingId === b.id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={updatingId === b.id}
                    onClick={() => handleStatusUpdate(b.id, "Cancelled")}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedBooking(b)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title="Appointment Details"
        >
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {selectedBooking.name}</p>
            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
            <p><strong>Date & Time:</strong> {new Date(selectedBooking.datetime).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Intent:</strong> {selectedBooking.intent}</p>
            <p><strong>Stage:</strong> {selectedBooking.stage}</p>
            <p><strong>Transcript:</strong> {selectedBooking.transcript}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
