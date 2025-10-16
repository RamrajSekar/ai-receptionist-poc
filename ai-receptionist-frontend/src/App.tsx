import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageAppointments from "./pages/ManageAppointments";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/manage" element={<ManageAppointments />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
