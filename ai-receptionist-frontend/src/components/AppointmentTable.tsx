"use client";

import { useState } from "react";

interface Booking {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  status: string;
}

interface Props {
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
}

export default function AppointmentTable({ bookings, onStatusChange }: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!bookings || bookings.length === 0) {
    return <p className="text-gray-500 text-center py-6">No appointments found.</p>;
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    await onStatusChange(id, status);
    setUpdatingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Phone</th>
            <th className="py-2 px-4 border-b text-left">Date & Time</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{booking.name}</td>
              <td className="py-2 px-4 border-b">{booking.phone}</td>
              <td className="py-2 px-4 border-b">
                {new Date(booking.datetime).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b font-semibold">
                {booking.status}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors ${
                    updatingId === booking.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={updatingId === booking.id}
                  onClick={() => handleStatusUpdate(booking.id, "Confirmed")}
                >
                  Confirm
                </button>
                <button
                  className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors ${
                    updatingId === booking.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={updatingId === booking.id}
                  onClick={() => handleStatusUpdate(booking.id, "Cancelled")}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
