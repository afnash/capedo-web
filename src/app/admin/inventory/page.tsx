"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminInventory() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadItems() {
      try {
        const { fetchItems } = await import("@/app/actions");
        const data = await fetchItems();

        // Add dummy stock data since it's not in the items table schema
        const dataWithStock = (data || []).map((item: any) => ({
          ...item,
          stock: Math.floor(Math.random() * 200),
          maxStock: 200,
          stockStatus: "normal",
          categoryColor: "bg-primary-container/20 text-on-primary-container"
        }));
        setInventoryItems(dataWithStock);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col border-r border-outline-variant bg-surface-container-low w-64 z-40">
        <div className="p-md">
          <div className="flex items-center gap-3 mb-2">
            <img alt="Capedo Impex Logo" className="w-10 h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh" />
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Capedo Impex</h1>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md">Admin Panel</p>
        </div>
        <nav className="flex-1 mt-md">
          <Link href="/admin" className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high transition-colors font-label-md text-label-md">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/inventory" className="bg-primary-container text-on-primary-container rounded-xl mx-2 my-1 px-4 py-3 flex items-center gap-3 font-label-md text-label-md">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Inventory</span>
          </Link>
          <Link href="#" className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high transition-colors font-label-md text-label-md">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span>Orders</span>
          </Link>
          <Link href="#" className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high transition-colors font-label-md text-label-md">
            <span className="material-symbols-outlined">campaign</span>
            <span>Banners</span>
          </Link>
        </nav>
        <div className="p-md mt-auto border-t border-outline-variant">
          <div className="flex items-center gap-3 mb-md">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
              <img alt="Admin User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0TMvsZ-iXZyP5v0PQLU3mp8dpHxy2EkXLWpDT52Vk6uqDpzqHPI71pXdH4uLPFUMsQnerPZchHmOh-tSI1C6lL5E-j2eXSY0m2apWUnwrgjYO9pnsMhBNtZfW_kxY0G04KygayZI4u_aiSdB1nkkFufieObAz4XheSJ37NPknv3r9QXNmbKwvjZ9BwfkLYbBT4CJ8MiopjNPayuWafisAN7aB2v9En3qYB-02hM8m-hP74x5FW3WrSNYX2tbGYRDY1FG7R2dX-q0y" />
            </div>
            <div>
              <p className="font-label-md text-label-md">Admin User</p>
              <p className="text-caption font-caption text-on-surface-variant">Manage Capedo Impex</p>
            </div>
          </div>
          <button className="w-full py-2 border border-outline text-primary font-label-md text-label-md rounded-lg hover:bg-primary-container hover:border-primary-container transition-all">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 p-margin-desktop min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Inventory Management</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">Keep your stock levels fresh and accurate.</p>
          </div>
          <button onClick={toggleModal} className="bg-primary text-on-primary px-md py-3 rounded-xl font-label-md text-label-md flex items-center gap-2 shadow-sm hover:opacity-90 transition-all scale-95 active:scale-90">
            <span className="material-symbols-outlined">add</span>
            Add New Item
          </button>
        </header>

        {/* High Density Table Container */}
        <div className="bg-surface-container-lowest rounded-xl floating-shadow overflow-hidden flex-1 mb-xl">
          <div className="p-sm flex justify-between items-center border-b border-outline-variant">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all" placeholder="Search products..." type="text" />
            </div>
            <div className="flex gap-xs">
              <button className="flex items-center gap-1 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-colors">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Export
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-left border-b border-outline-variant">
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant">Image</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant">Item Name</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant">Category</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant">Price (£)</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant">Stock Level</th>
                <th className="px-md py-4 font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {inventoryItems.map((item: any, index: number) => (
                <tr key={item.id || index} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="px-md py-4">
                    <div className="w-12 h-12 rounded-lg bg-surface overflow-hidden border border-outline-variant">
                      <img alt={item.name} className="w-full h-full object-cover" src={item.image_url || "https://placehold.co/100"} />
                    </div>
                  </td>
                  <td className="px-md py-4 font-body-md text-body-md text-on-surface font-semibold">{item.name}</td>
                  <td className="px-md py-4">
                    <span className={`px-3 py-1 rounded-full text-caption font-label-md ${item.categoryColor}`}>{item.category}</span>
                  </td>
                  <td className="px-md py-4 font-body-md text-body-md">£{item.price}</td>
                  <td className="px-md py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.stockStatus === 'low' ? 'bg-error' : item.stockStatus === 'warning' ? 'bg-[#f0ad00]' : 'bg-primary'}`}
                          style={{ width: `${Math.min(100, Math.round((item.stock / item.maxStock) * 100))}%` }}
                        ></div>
                      </div>
                      <span className={`text-caption ${item.stockStatus === 'low' ? 'text-error' : item.stockStatus === 'warning' ? 'text-[#5e4200]' : 'text-on-surface-variant'}`}>
                        {item.stockStatus === 'low' || item.stockStatus === 'warning' ? `Low: ${item.stock} units` : `${item.stock} units`}
                      </span>
                    </div>
                  </td>
                  <td className="px-md py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                      <button className="p-2 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="p-md bg-surface-container-low flex justify-between items-center border-t border-outline-variant">
            <p className="text-caption font-caption text-on-surface-variant">Showing 1-4 of 124 items</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md">1</button>
              <button className="px-4 py-2 rounded-lg hover:bg-surface-container-high font-label-md text-label-md transition-colors">2</button>
              <button className="px-4 py-2 rounded-lg hover:bg-surface-container-high font-label-md text-label-md transition-colors">3</button>
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Footer Shell */}
        <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
          <div className="w-full py-md px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-lg max-w-[1280px] mx-auto">
            <p className="font-caption text-caption text-on-surface-variant">© 2026 Capedo Impex. Quality and Efficiency in Every Trade.</p>
            <div className="flex gap-md justify-end">
              <a className="text-on-surface-variant font-caption text-caption hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="text-on-surface-variant font-caption text-caption hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="text-on-surface-variant font-caption text-caption hover:text-primary transition-colors" href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Modal: Add New Item */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile">
          <div className="absolute inset-0 bg-[#151b29] bg-opacity-40 backdrop-blur-sm" onClick={toggleModal}></div>
          <div className="relative bg-surface rounded-2xl w-full max-w-[512px] shadow-2xl overflow-hidden scale-100 transition-transform duration-300">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">Add New Product</h3>
              <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center" onClick={toggleModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="p-md space-y-md" onSubmit={(e) => { e.preventDefault(); toggleModal(); }}>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Product Name</label>
                <input className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none font-body-md text-body-md bg-transparent" placeholder="e.g., Organic Avocados" type="text" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Description</label>
                <textarea className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none font-body-md text-body-md resize-none bg-transparent" placeholder="Describe the item's origin and freshness..." rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs">Price (£)</label>
                  <input className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none font-body-md text-body-md bg-transparent" placeholder="0.00" step="0.01" type="number" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs">Category</label>
                  <select className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all outline-none font-body-md text-body-md bg-surface">
                    <option>Fruits</option>
                    <option>Vegetables</option>
                    <option>Meat</option>
                    <option>Fish</option>
                    <option>Desserts</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Product Image</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-lg text-center hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-outline text-[48px] group-hover:text-primary mb-xs">cloud_upload</span>
                  <p className="font-label-md text-label-md text-on-surface-variant">Click to upload or drag and drop</p>
                  <p className="text-caption font-caption text-on-surface-variant">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
              <div className="flex gap-md pt-md">
                <button className="flex-1 py-3 border border-outline text-on-surface-variant font-label-md text-label-md rounded-xl hover:bg-surface-container-high transition-colors" onClick={toggleModal} type="button">
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:opacity-90 transition-colors shadow-sm" type="submit">
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
