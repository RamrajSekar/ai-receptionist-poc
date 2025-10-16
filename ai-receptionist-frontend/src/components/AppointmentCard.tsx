export default function AppointmentCard({ name, date, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 transition"
    >
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">Date: {date}</div>
      </div>
      <span className="text-gray-400 text-xl">›</span>
    </div>
  );
}
