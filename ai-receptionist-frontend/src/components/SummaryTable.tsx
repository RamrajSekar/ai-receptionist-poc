"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";

interface SummaryProps {
  summary: Record<string, { confirmed: number; pending: number; cancelled: number }>;
}

export default function SummaryTable({ summary }: SummaryProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedSummary = useMemo(() => {
    const entries = Object.entries(summary);
    entries.sort((a, b) => {
      const da = new Date(a[0]).getTime();
      const db = new Date(b[0]).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });
    return entries;
  }, [summary, sortOrder]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Daily Summary</h2>
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th
              className="px-4 py-2 border-b cursor-pointer select-none flex items-center gap-1 text-left"
              onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
            >
              Date
              <ArrowUpDown size={16} className="text-gray-500" />
            </th>
            <th className="px-4 py-2 border-b text-center">Confirmed</th>
            <th className="px-4 py-2 border-b text-center">Pending</th>
            <th className="px-4 py-2 border-b text-center">Cancelled</th>
          </tr>
        </thead>
        <tbody>
          {sortedSummary.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No appointments available.
              </td>
            </tr>
          ) : (
            sortedSummary.map(([date, counts]) => (
              <tr key={date} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 border-b font-medium text-left">{date}</td>
                <td className="px-4 py-2 border-b text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                    {counts.confirmed}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-semibold">
                    {counts.pending}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                    {counts.cancelled}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
