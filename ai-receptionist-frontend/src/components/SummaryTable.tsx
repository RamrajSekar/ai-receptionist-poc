"use client";

import { useMemo } from "react";
import { CalendarDays, CheckCircle, XCircle, Clock, CircleDot } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  status: string;
}

interface SummaryTableProps {
  bookings: Booking[];
}

export default function SummaryTable({ bookings }: SummaryTableProps) {
  const todaySummary = useMemo(() => {
    const todayKey = new Date().toLocaleDateString();
    const summary = { confirmed: 0, pending: 0, cancelled: 0, completed: 0 };

    bookings.forEach((b) => {
      const dateKey = new Date(b.datetime).toLocaleDateString();
      if (dateKey === todayKey) {
        const s = b.status.toLowerCase();
        if (s === "confirmed") summary.confirmed++;
        else if (s === "cancelled") summary.cancelled++;
        else if (s === "completed") summary.completed++;
        else summary.pending++;
      }
    });

    return { date: todayKey, ...summary };
  }, [bookings]);

  const summaryItems = [
    { label: "Confirmed", value: todaySummary.confirmed, color: "text-green-600", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Pending", value: todaySummary.pending, color: "text-yellow-500", icon: <Clock className="w-5 h-5" /> },
    { label: "Cancelled", value: todaySummary.cancelled, color: "text-red-500", icon: <XCircle className="w-5 h-5" /> },
    { label: "Completed", value: todaySummary.completed, color: "text-blue-600", icon: <CircleDot className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-800">
          Daily Summary ({todaySummary.date})
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center bg-gray-50 rounded-lg p-4 shadow-sm"
          >
            <div className={`mb-2 ${item.color}`}>{item.icon}</div>
            <p className="text-gray-700 text-sm font-medium">{item.label}</p>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
