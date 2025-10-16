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
  onDelete: (phone: string) => void;
}

export default function AppointmentTable({ bookings, onStatusChange, onDelete }: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!bookings || bookings.length === 0) {
    return <p className="text-gray-500">No appointments found.</p>;
  }

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
              <td className="py-2 px-4 border-b">
                <select
                  value={booking.status}
                  className={`border rounded px-2 py-1 ${
                    updatingId === booking.id ? "bg-gray-200" : "bg-white"
                  }`}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    setUpdatingId(booking.id);
                    await onStatusChange(booking.id, newStatus);
                    setUpdatingId(null);
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                  onClick={() => onDelete(booking.phone)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
