import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import Toggle from "../components/Toggle";
import DateTimeInput from "../components/DateTimeInput";

export default function Settings() {
  const [available, setAvailable] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSave = () => {
    const scheduleData = { available, startTime, endTime };
    console.log("Saved schedule:", scheduleData);
    
  };

  return (
    <DashboardLayout>
      <Header title="Settings" actionLabel="Save Changes" onAction={handleSave} />

      <div className="bg-white rounded-xl shadow-sm p-6 text-gray-700 space-y-8">
        {/* My Schedule Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">My Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Toggle label="Available" value={available} onChange={setAvailable} />
            <DateTimeInput label="Start Time" value={startTime} onChange={setStartTime} />
            <DateTimeInput label="End Time" value={endTime} onChange={setEndTime} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
