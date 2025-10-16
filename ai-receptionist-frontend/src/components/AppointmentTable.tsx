import StatusBadge from "./StatusBadge";

export default function AppointmentTable({ title, data, onViewAll, onUpdate }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onViewAll && (
          <button onClick={onViewAll} className="border px-3 py-1 rounded-lg hover:bg-gray-100">
            View All
          </button>
        )}
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2">First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-3">{row.first}</td>
              <td>{row.last}</td>
              <td>{row.phone}</td>
              <td>{row.date}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                <button
                  onClick={() => onUpdate && onUpdate(row)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
