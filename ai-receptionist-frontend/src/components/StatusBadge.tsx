export default function StatusBadge({ status }: any) {
  const colors: any = {
    open: "bg-green-100 text-green-700",
    booked: "bg-yellow-100 text-yellow-700",
    completed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm capitalize ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
