"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboard() {
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-container-highest z-50">
        <div className="px-6 py-8">
          <div className="flex items-center gap-2 mb-2">
            <img alt="Capedo Impex Logo" className="w-10 h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh" />
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">Capedo Impex</h1>
          </div>
          <p className="text-on-surface-variant font-caption text-caption mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {/* Dashboard Tab (Active) */}
          <Link href="/admin" className="bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary rounded-xl mx-2 my-1 px-4 py-3 flex items-center gap-3 font-label-md text-label-md transition-opacity">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          {/* Inventory Tab */}
          <Link href="/admin/inventory" className="text-on-surface-variant dark:text-secondary-fixed-dim mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high font-label-md text-label-md transition-colors">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Inventory</span>
          </Link>
          {/* Orders Tab */}
          <Link href="#" className="text-on-surface-variant dark:text-secondary-fixed-dim mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high font-label-md text-label-md transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span>Orders</span>
          </Link>
          {/* Banners Tab */}
          <Link href="#" className="text-on-surface-variant dark:text-secondary-fixed-dim mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high font-label-md text-label-md transition-colors">
            <span className="material-symbols-outlined">campaign</span>
            <span>Banners</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold overflow-hidden border border-outline-variant">
              <img alt="Admin User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyhBWs6usLwtL-ru2ksLfQwnlSFJBLNsz4iyUptxjxnJO7xE_I6X9EUDyb1WGJC-MOk-pkM4xw84Ct51W2hqK2He0paHOs_x6MMDwMhvdcw6OZgzQmdwI1fksRv01nh0HK7yW54GgYnbQ_HgwCFdTxvlm3cHYJb3Y7seUcPus_iK2D0SoEyIKEmthW64umH0EMNmow8a86J_OZW-AdvClO89_p3fI9CKMnx3YDHM1UiasmHxlT3lYU017MiPp3b7Nw-HrdBBwfEDe0" />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">Admin User</p>
              <p className="text-caption font-caption text-on-surface-variant">Manage Capedo Impex</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 rounded-xl border border-outline text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 p-margin-desktop min-h-screen pb-xl">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">Overview</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Monitor Capedo Impex performance and inventory status.</p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 transition-all">
              <span className="material-symbols-outlined">add</span>
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {/* Bento Grid Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          {/* Total Sales Card */}
          <div className="bg-surface-container-lowest p-md rounded-xl floating-shadow border border-surface-container flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Sales</p>
                <h3 className="font-headline-lg text-headline-lg text-on-background">$12,480.50</h3>
              </div>
              <div className="p-2 bg-primary-container/20 rounded-lg">
                <span className="material-symbols-outlined text-primary">trending_up</span>
              </div>
            </div>
            <div className="z-10">
              <p className="text-caption font-caption text-primary flex items-center gap-1">
                <span className="font-bold">+12.5%</span> from last week
              </p>
            </div>
            {/* Subtle background visual */}
            <div className="absolute -bottom-6 -right-6 opacity-5">
              <span className="material-symbols-outlined text-primary text-[120px]">payments</span>
            </div>
          </div>

          {/* Active Orders Card */}
          <div className="bg-surface-container-lowest p-md rounded-xl floating-shadow border border-surface-container flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">Active Orders</p>
                <h3 className="font-headline-lg text-headline-lg text-on-background">42</h3>
              </div>
              <div className="p-2 bg-surface-container-high rounded-lg">
                <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
              </div>
            </div>
            <div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%]"></div>
              </div>
              <p className="text-caption font-caption text-on-surface-variant mt-2">
                28 orders in delivery
              </p>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-error-container/30 p-md rounded-xl floating-shadow border border-error-container/50 flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-md text-label-md text-on-error-container mb-1">Low Stock Alerts</p>
                <h3 className="font-headline-lg text-headline-lg text-on-error-container">14</h3>
              </div>
              <div className="p-2 bg-error-container rounded-lg">
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
            </div>
            <button className="text-label-md font-label-md text-error flex items-center gap-1 hover:underline text-left">
              Restock now
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Recent Orders Table Section */}
          <section className="lg:col-span-2 space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-background">Recent Orders</h3>
              <button className="text-primary font-label-md text-label-md hover:underline">View All</button>
            </div>
            <div className="bg-surface-container-lowest rounded-xl floating-shadow overflow-hidden border border-surface-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low/50">
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Order ID</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Customer</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface">#ORD-2841</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">JS</div>
                        <span className="font-body-md text-body-md text-on-surface">Jane Smith</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary-container/20 text-on-primary-container rounded-full text-caption font-caption">Delivered</span>
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface text-right font-bold">$142.00</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface">#ORD-2840</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">MH</div>
                        <span className="font-body-md text-body-md text-on-surface">Marcus H.</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-tertiary-container/20 text-on-tertiary-fixed-variant rounded-full text-caption font-caption">Processing</span>
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface text-right font-bold">$84.50</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface">#ORD-2839</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">AL</div>
                        <span className="font-body-md text-body-md text-on-surface">Anna Lee</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-caption font-caption">Shipped</span>
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface text-right font-bold">$210.15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions Section */}
          <aside className="space-y-md">
            <h3 className="font-headline-md text-headline-md text-on-background">Quick Actions</h3>
            {/* Action: Banner Upload */}
            <div className="bg-surface-container-lowest p-md rounded-xl floating-shadow border border-surface-container space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-container rounded-lg">
                  <span className="material-symbols-outlined text-on-primary-container">add_photo_alternate</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface">Upload New Banner</p>
              </div>
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-2 group hover:border-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary">upload_file</span>
                <p className="text-caption font-caption text-on-surface-variant">Drop image here or click to browse</p>
              </div>
              <button onClick={showToast} className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-all">
                Publish Banner
              </button>
            </div>
            {/* Action: Update Info */}
            <div className="bg-surface-container-lowest p-md rounded-xl floating-shadow border border-surface-container space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-container rounded-lg">
                  <span className="material-symbols-outlined text-on-secondary-container">local_shipping</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface">Update Delivery Info</p>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Current Estimated Time</label>
                  <input className="border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" type="text" defaultValue="30-45 mins" />
                </div>
                <button onClick={showToast} className="w-full py-3 border border-outline text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-high transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-xl pt-md border-t border-outline-variant">
          <div className="flex justify-between items-center text-caption font-caption text-on-surface-variant">
            <p>© 2026 Capedo Impex. All rights reserved.</p>
            <div className="flex gap-sm">
              <a className="hover:text-primary" href="#">Privacy Policy</a>
              <a className="hover:text-primary" href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Success Toast Notification */}
      <div className={`fixed bottom-margin-mobile right-margin-mobile glass-card border border-primary/20 px-6 py-4 rounded-xl floating-shadow flex items-center gap-3 transform transition-transform duration-300 pointer-events-none ${toastVisible ? 'translate-y-0' : 'translate-y-24'}`}>
        <span className="material-symbols-outlined text-primary">check_circle</span>
        <p className="font-label-md text-label-md text-on-surface">Action completed successfully</p>
      </div>
    </div>
  );
}
