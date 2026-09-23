import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Users,
  BarChart3,
  Truck,
  LogOut,
  Menu,
  X,
  Home,
  Star,
  QrCode,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menu = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["owner", "kasir", "kurir"],
  },
  {
    to: "/new",
    icon: PlusCircle,
    label: "Order Baru",
    roles: ["owner", "kasir"],
  },
  {
    to: "/orders",
    icon: ListOrdered,
    label: "Daftar Order",
    roles: ["owner", "kasir", "kurir"],
  },
  {
    to: "/customers",
    icon: Users,
    label: "Pelanggan",
    roles: ["owner", "kasir"],
  },
  {
    to: "/delivery",
    icon: Truck,
    label: "Pengiriman",
    roles: ["owner", "kurir"],
  },
  { to: "/testimonials", icon: Star, label: "Testimoni", roles: ["owner"] },
  { to: "/qr", icon: QrCode, label: "QR Code", roles: ["owner"] },
  { to: "/reports", icon: BarChart3, label: "Laporan", roles: ["owner"] },
];

export default function Sidebar() {
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const visible = menu.filter((m) => m.roles.includes(profile?.role));

  const handleNavClick = () => setOpen(false);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-base">
            🧺
          </div>
          <span className="font-bold text-slate-800">LaundryKu</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-slate-600">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop Mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
              🧺
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight text-slate-800">
                LaundryKu
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                {profile?.role || "Staff"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visible.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="border-t border-slate-100 my-2" />

          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Home size={18} />
            <span>Ke Halaman Publik</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100">
          <div className="mb-2 px-3 py-2 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 truncate">
              {profile?.full_name || "Staff"}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              {profile?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Spacer mobile biar konten gak ketutup topbar */}
      <div className="lg:hidden h-14" />
    </>
  );
}