"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, EyeOff, Lock, User, LogOut, LayoutDashboard, Package, Image as ImageIcon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    async function checkSavedCreds() {
      const savedUser = sessionStorage.getItem("admin_user");
      const savedPass = sessionStorage.getItem("admin_pass");
      if (savedUser && savedPass) {
        try {
          const { verifyCredentials } = await import("@/app/actions");
          const isValid = await verifyCredentials(savedUser, savedPass);
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem("admin_user");
            sessionStorage.removeItem("admin_pass");
          }
        } catch (err) {
          console.error("Error verifying admin credentials:", err);
        }
      }
      setVerifying(false);
    }
    checkSavedCreds();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const { verifyCredentials } = await import("@/app/actions");
      const isValid = await verifyCredentials(username, password);
      if (isValid) {
        sessionStorage.setItem("admin_user", username);
        sessionStorage.setItem("admin_pass", password);
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("An error occurred during authentication.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_user");
    sessionStorage.removeItem("admin_pass");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#f3f7f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#15803d]"></div>
          <p className="text-[#15803d] font-bold text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f7f4] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-[0_8px_30px_rgba(21,128,61,0.08)] border border-[#15803d]/15">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#e2ece5] flex items-center justify-center p-3 mb-4 border border-[#15803d]/20">
              <img
                alt="Capedo Impex Logo"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh"
              />
            </div>
            <h1 className="font-extrabold text-2xl text-[#113a1a]">Admin Portal Login</h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Enter your admin credentials to access Capedo Impex management.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#15803d]">
                  <User size={18} />
                </span>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#15803d]">
                  <Lock size={18} />
                </span>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#15803d] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Inventory", href: "/admin/inventory", icon: Package },
    { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  ];

  return (
    <div className="bg-[#f3f7f4] min-h-screen text-on-surface flex">
      {/* Sidebar Shell */}
      <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-[#d2dfd5] bg-white z-40">
        <div className="p-6 border-b border-[#f0f4f1]">
          <Link href="/" className="flex items-center gap-3">
            <img
              alt="Capedo Impex Logo"
              className="w-10 h-10 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh"
            />
            <div>
              <h1 className="font-extrabold text-[#113a1a] text-lg leading-tight">Capedo Impex</h1>
              <p className="text-xs text-[#15803d] font-bold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-[#15803d] text-white shadow-sm"
                    : "text-[#113a1a]/70 hover:bg-[#e2ece5] hover:text-[#113a1a]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#f0f4f1] mt-auto">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#e2ece5] border border-[#15803d]/20 flex items-center justify-center text-[#15803d] font-bold text-sm">
              A
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-[#113a1a] truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Capedo Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="ml-64 flex-1 p-8 min-h-screen">
        {children}
      </div>
    </div>
  );
}
