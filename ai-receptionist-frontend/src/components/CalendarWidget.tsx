export default function CalendarWidget({ month, year, activeDates }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
      <div className="font-semibold mb-4">
        {month} {year}
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
  <div key={`${d}-${i}`} className="font-medium text-gray-500">
    {d}
  </div>
))}

        {Array.from({ length: 30 }).map((_, i) => {
          const day = i + 1;
          const isActive = activeDates.includes(day);
          return (
            <div
              key={day}
              className={`p-2 rounded-full ${
                isActive ? "bg-green-100 text-green-700 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
