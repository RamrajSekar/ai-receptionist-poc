import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Settings } from "lucide-react";
import Logo from "../assets/logo.png"; // Import the logo

export default function Sidebar({ profile }: { profile: any }) {
  const menu = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/manage", label: "Manage Appointments", icon: <CalendarDays size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

 
  const profileImage = profile?.image || Logo;

  return (
    <aside className="w-64 bg-black text-white flex flex-col justify-between min-h-screen p-6">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className=" rounded overflow-hidden flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          
        </div>

        <nav className="space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-white text-black font-medium" : "hover:bg-gray-800"
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
