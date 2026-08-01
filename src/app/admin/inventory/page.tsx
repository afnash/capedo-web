"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, UploadCloud, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const categories = [
  "Fruits",
  "Vegetables",
  "Leaves",
  "Root Vegetables",
  "Herbs",
  "Leafy Greens",
  "Flowers"
];

export default function AdminInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal / Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(categories[0]);
  const [formPrice, setFormPrice] = useState("");
  const [formDiscount, setFormDiscount] = useState("0");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const { fetchItems } = await import("@/app/actions");
      const data = await fetchItems();
      setItems(data || []);
    } catch (err) {
      console.error("Error loading inventory items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory(categories[0]);
    setFormPrice("");
    setFormDiscount("0");
    setFormDescription("");
    setFormImageUrl("");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormName(item.name || "");
    setFormCategory(item.category || categories[0]);
    setFormPrice(item.price !== undefined ? String(item.price) : "");
    setFormDiscount(item.discount !== undefined ? String(item.discount) : "0");
    setFormDescription(item.description || "");
    setFormImageUrl(item.image_url || "");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const user = sessionStorage.getItem("admin_user") || "";
    const pass = sessionStorage.getItem("admin_pass") || "";

    try {
      let finalImageUrl = formImageUrl;

      // If a new file is uploaded, push to Supabase items storage bucket
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop() || 'png';
        const fileName = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;

        try {
          // Attempt bucket creation if not existing
          try {
            await supabase.storage.createBucket('items', { public: true });
          } catch (_) {}

          const { error: uploadErr } = await supabase.storage
            .from('items')
            .upload(fileName, selectedFile, { upsert: true });

          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from('items').getPublicUrl(fileName);
            finalImageUrl = urlData.publicUrl;
          }
        } catch (storageErr) {
          console.error("Storage upload error:", storageErr);
        }
      }

      const itemPayload = {
        id: editingItem ? editingItem.id : undefined,
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice) || formPrice,
        discount: parseFloat(formDiscount) || 0,
        description: formDescription,
        image_url: finalImageUrl || null
      };

      const { saveItem } = await import("@/app/actions");
      await saveItem(itemPayload, user, pass);

      showToast(editingItem ? "Item updated successfully!" : "New product created successfully!");
      closeModal();
      await loadItems();
    } catch (err: any) {
      console.error("Failed to save item:", err);
      showToast(err.message || "Failed to save item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: any) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const user = sessionStorage.getItem("admin_user") || "";
    const pass = sessionStorage.getItem("admin_pass") || "";

    try {
      const { deleteItem } = await import("@/app/actions");
      await deleteItem(id, user, pass);
      showToast("Product deleted successfully!");
      await loadItems();
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      showToast(err.message || "Failed to delete item.");
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#113a1a]">Inventory Management</h1>
          <p className="text-sm text-[#113a1a]/70 font-medium mt-1">
            Manage product catalog, prices, and images saved to Supabase.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#15803d] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#166534] transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#d2dfd5] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#15803d]" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "All"
                ? "bg-[#15803d] text-white"
                : "bg-[#f8faf8] text-[#113a1a]/70 hover:bg-[#e2ece5]"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#15803d] text-white"
                  : "bg-[#f8faf8] text-[#113a1a]/70 hover:bg-[#e2ece5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#d2dfd5] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15803d] mx-auto mb-3"></div>
            Loading inventory products from Supabase...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            No inventory items found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8faf8] border-b border-[#d2dfd5] text-xs font-extrabold text-[#113a1a]/70 uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {filteredItems.map((item: any, index: number) => (
                  <tr key={item.id || index} className="hover:bg-[#f8faf8] transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#d2dfd5] overflow-hidden flex items-center justify-center p-1">
                        <img
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                          src={item.image_url || "https://placehold.co/100"}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3 font-bold text-sm text-[#113a1a]">
                      {item.name}
                      {item.description && (
                        <p className="text-xs font-normal text-gray-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 bg-[#e2ece5] text-[#15803d] rounded-full text-xs font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-sm text-[#15803d]">
                      {typeof item.price === 'number' || !isNaN(parseFloat(item.price))
                        ? `£${item.price}`
                        : item.price}
                    </td>
                    <td className="px-6 py-3 text-xs font-bold text-gray-600">
                      {item.discount ? `${item.discount}% OFF` : "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-500 hover:text-[#15803d] hover:bg-[#e2ece5] rounded-xl transition-all"
                          title="Edit Item"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#15803d]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#f0f4f1] pb-4 mb-4">
              <h2 className="text-xl font-extrabold text-[#113a1a]">
                {editingItem ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Green Banana"
                  className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                    Price (£ or Text)
                  </label>
                  <input
                    required
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 30 or As per demand"
                    className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter product description..."
                  className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Image Upload or URL
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#e2ece5] file:text-[#15803d] hover:file:bg-[#15803d] hover:file:text-white transition-all cursor-pointer"
                  />
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Or paste public image URL"
                    className="w-full px-4 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-xs outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-[#d2dfd5] text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#113a1a] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 z-50">
          <CheckCircle size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
