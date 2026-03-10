import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore Botswana", path: "/explore" },
    { name: "Categories", path: "/explore" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-black/5 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
          <span className="text-xl font-serif font-bold tracking-tight text-[#5A5A40]">TourBots</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-600 hover:text-[#5A5A40] transition-colors">
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-[#5A5A40] bg-[#5A5A40]/10 px-4 py-2 rounded-full">
                <User size={16} />
                Dashboard
              </Link>
              <button onClick={() => { logout(); navigate("/"); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#5A5A40] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#4A4A30] transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-black/5 p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-600" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col gap-4 pt-4 border-t border-black/5">
              <Link to="/dashboard" className="text-sm font-medium text-[#5A5A40]" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); navigate("/"); setIsOpen(false); }} className="text-sm font-medium text-red-500 text-left">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#5A5A40] text-white px-6 py-2 rounded-full text-sm font-medium text-center" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
