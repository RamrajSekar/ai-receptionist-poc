"use client";

import { useState } from "react";
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

interface AppointmentTableProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: string) => void;
}

export default function AppointmentTable({ bookings, onStatusChange }: AppointmentTableProps) {
  const [selected, setSelected] = useState<Booking | null>(null);

  // Simple theme-based button colors
  const buttonColors: Record<string, string> = {
    confirm: "bg-[#007C8C] text-white hover:bg-[#005f66]",
    cancel: "bg-red-500 text-white hover:bg-red-600",
    complete: "bg-green-600 text-white hover:bg-green-700",
    view: "bg-[#003D4D] text-white hover:bg-[#005f66]",
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-600",
    confirmed: "text-green-600",
    cancelled: "text-red-600",
    completed: "text-blue-600",
  };

  const renderButtons = (b: Booking) => {
    const status = b.status.toLowerCase();
    const buttons = [];

    if (status === "pending new" || status === "pending now" || status === "pending") {
      buttons.push(
        <button key="confirm" className={`px-3 py-1 rounded ${buttonColors.confirm}`} onClick={() => onStatusChange(b.id, "Confirmed")}>
          Confirm
        </button>
      );
      buttons.push(
        <button key="cancel" className={`px-3 py-1 rounded ${buttonColors.cancel}`} onClick={() => onStatusChange(b.id, "Cancelled")}>
          Cancel
        </button>
      );
    }

    if (status === "confirmed") {
      buttons.push(
        <button key="complete" className={`px-3 py-1 rounded ${buttonColors.complete}`} onClick={() => onStatusChange(b.id, "Completed")}>
          Complete
        </button>
      );
    }

    buttons.push(
      <button key="view" className={`px-3 py-1 rounded ${buttonColors.view}`} onClick={() => setSelected(b)}>
        View
      </button>
    );

    return <div className="flex flex-wrap gap-2">{buttons}</div>;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-x-auto">
      <div className="max-h-80 overflow-y-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Name", "Phone", "Date & Time", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-2 text-left border-b border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6 italic">
                  No appointments found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-2">{b.name}</td>
                  <td className="px-4 py-2">{b.phone}</td>
                  <td className="px-4 py-2">{new Date(b.datetime).toLocaleString()}</td>
                  <td className={`px-4 py-2 font-semibold capitalize ${statusColors[b.status.toLowerCase()] || "text-gray-600"}`}>
                    {b.status}
                  </td>
                  <td className="px-4 py-2">{renderButtons(b)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Appointment Details">
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
