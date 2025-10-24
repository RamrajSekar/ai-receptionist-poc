import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import Logo from "../assets/ai-logo.png"; 

export default function Sidebar() {
  const menu = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#003D4D] text-[#D5E1E3] flex flex-col justify-between min-h-screen p-6">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="rounded overflow-hidden w-15 h-15 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-full h-full object-contain rounded-4xl" />
          </div>
          <h2 className="text-xm font-bold text-white">AI Receptionist</h2>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#003D4D] font-medium shadow-sm"
                    : "hover:bg-[#007C8C] hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
