"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, TrendingUp, Package, Image as ImageIcon, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [toastMessage, setToastMessage] = useState("");
  const [addressData, setAddressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const [bannerCount, setBannerCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const { fetchItems, fetchBanners, fetchAddress } = await import("@/app/actions");
        const [items, banners, address] = await Promise.all([
          fetchItems(),
          fetchBanners(),
          fetchAddress()
        ]);
        setItemCount(items ? items.length : 0);
        setBannerCount(banners ? banners.length : 0);
        setAddressData(address);
      } catch (err) {
        console.error("Error loading admin overview stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = sessionStorage.getItem("admin_user") || "";
    const pass = sessionStorage.getItem("admin_pass") || "";
    try {
      const { updateAddress } = await import("@/app/actions");
      await updateAddress(addressData, user, pass);
      showToast("Store delivery address updated successfully!");
    } catch (err) {
      console.error("Failed to update address:", err);
      showToast("Failed to update address.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#113a1a]">Dashboard Overview</h1>
          <p className="text-sm text-[#113a1a]/70 font-medium mt-1">
            Monitor Capedo Impex store metrics, inventory status, and promotional banners.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/inventory"
            className="flex items-center gap-2 bg-[#15803d] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#166534] transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>Add Inventory Item</span>
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 bg-white border border-[#15803d]/30 text-[#15803d] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e2ece5] transition-all shadow-sm"
          >
            <ImageIcon size={16} />
            <span>Manage Banners</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-[#d2dfd5] shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Active Catalog Produce
              </p>
              <h2 className="text-3xl font-extrabold text-[#113a1a]">
                {loading ? "..." : itemCount}
              </h2>
            </div>
            <div className="p-3 bg-[#e2ece5] text-[#15803d] rounded-xl">
              <Package size={22} />
            </div>
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <span className="text-xs text-[#15803d] font-bold flex items-center gap-1">
              <TrendingUp size={14} /> Synced with Supabase
            </span>
            <Link
              href="/admin/inventory"
              className="text-xs text-[#15803d] font-bold hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Promotional Banners */}
        <div className="bg-white p-6 rounded-2xl border border-[#d2dfd5] shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Active Hero Banners
              </p>
              <h2 className="text-3xl font-extrabold text-[#113a1a]">
                {loading ? "..." : bannerCount}
              </h2>
            </div>
            <div className="p-3 bg-[#e2ece5] text-[#15803d] rounded-xl">
              <ImageIcon size={22} />
            </div>
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <span className="text-xs text-[#15803d] font-bold flex items-center gap-1">
              <ShieldCheck size={14} /> Supabase Bucket: &apos;banners&apos;
            </span>
            <Link
              href="/admin/banners"
              className="text-xs text-[#15803d] font-bold hover:underline flex items-center gap-1"
            >
              Edit Banners <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-[#15803d] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Database Status
              </span>
            </div>
            <h2 className="text-xl font-bold mb-1">Supabase Online</h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Data read/write operations connected to Supabase PostgreSQL & Storage buckets.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-100 flex items-center gap-1">
            <CheckCircle size={14} /> Automatic Local JSON Fallback Active
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Management Links & Recent Items Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#d2dfd5] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#113a1a] mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/inventory"
                className="p-5 rounded-2xl border border-[#d2dfd5] hover:border-[#15803d] hover:bg-[#f8faf8] transition-all flex items-start gap-4 group"
              >
                <div className="p-3 bg-[#e2ece5] text-[#15803d] rounded-xl group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#113a1a] group-hover:text-[#15803d] transition-colors">
                    Inventory Management
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Add, edit prices, update discounts, or delete products.
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/banners"
                className="p-5 rounded-2xl border border-[#d2dfd5] hover:border-[#15803d] hover:bg-[#f8faf8] transition-all flex items-start gap-4 group"
              >
                <div className="p-3 bg-[#e2ece5] text-[#15803d] rounded-xl group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#113a1a] group-hover:text-[#15803d] transition-colors">
                    Banner Management
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload banner images to &apos;banners&apos; bucket & update hero slider.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Store Delivery Information Update */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d2dfd5] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#113a1a] mb-4">Delivery & Contact Info</h2>
            {addressData ? (
              <form onSubmit={handleUpdateAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={addressData.name || ""}
                    onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={addressData.phone || ""}
                    onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={addressData.address || ""}
                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={addressData.pincode || ""}
                    onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:border-[#15803d]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm rounded-xl transition-all shadow-sm"
                >
                  Save Store Info
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">Loading delivery info...</p>
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#113a1a] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 z-50">
          <CheckCircle size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
