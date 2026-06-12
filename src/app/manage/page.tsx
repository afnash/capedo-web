"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

export default function ManageInventory() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [verifying, setVerifying] = useState(true);

  // Inventory state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(categories[0]);
  const [formPrice, setFormPrice] = useState("");
  const [formDiscount, setFormDiscount] = useState("0");
  const [formDescription, setFormDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  // Load saved credentials on mount
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
            await loadProducts();
          } else {
            sessionStorage.removeItem("admin_user");
            sessionStorage.removeItem("admin_pass");
          }
        } catch (err) {
          console.error("Error auto-verifying:", err);
        }
      }
      setVerifying(false);
    }
    checkSavedCreds();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const { fetchItems } = await import("@/app/actions");
      const data = await fetchItems();
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setVerifying(true);
    try {
      const { verifyCredentials } = await import("@/app/actions");
      const isValid = await verifyCredentials(username, password);
      if (isValid) {
        sessionStorage.setItem("admin_user", username);
        sessionStorage.setItem("admin_pass", password);
        setIsAuthenticated(true);
        await loadProducts();
      } else {
        setLoginError("Invalid username or password");
      }
    } catch (err) {
      setLoginError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("admin_user");
    sessionStorage.removeItem("admin_pass");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setProducts([]);
  };

  // Open modal for adding a new item
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

  // Open modal for editing an item
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormName(item.name || "");
    setFormCategory(item.category || categories[0]);
    setFormPrice(item.price || "");
    setFormDiscount(item.discount !== undefined ? String(item.discount) : "0");
    setFormDescription(item.description || "");
    setFormImageUrl(item.image_url || "");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // Upload file to Supabase items bucket
  const uploadImage = async (productName: string, file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      // Normalize product name to form clean filename e.g. "green-banana1.png"
      const fileExt = file.name.split(".").pop() || "png";
      const normalizedName = productName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
      const fileName = `${normalizedName}1.${fileExt}`;

      // Upload file with upsert
      const { data, error } = await supabase.storage
        .from("items")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Fetch public URL
      const { data: urlData } = supabase.storage
        .from("items")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Storing with fallback placeholder URL.");
      return formImageUrl || "https://placehold.co/400";
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle CRUD Form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Product name is required.");
      return;
    }

    setSubmittingForm(true);
    try {
      let finalImageUrl = formImageUrl;

      // If a new file is chosen, upload it first
      if (selectedFile) {
        finalImageUrl = await uploadImage(formName, selectedFile);
      }

      const user = sessionStorage.getItem("admin_user") || "";
      const pass = sessionStorage.getItem("admin_pass") || "";

      let updatedList = [...products];

      const newItem = {
        name: formName.trim(),
        category: formCategory,
        price: formPrice.trim(),
        discount: parseFloat(formDiscount) || 0,
        description: formDescription.trim(),
        image_url: finalImageUrl || "https://placehold.co/400"
      };

      if (editingItem) {
        // Edit existing: locate item by name/index
        updatedList = updatedList.map((item) =>
          item.name === editingItem.name ? newItem : item
        );
      } else {
        // Check for duplicates
        if (updatedList.some((item) => item.name.toLowerCase() === newItem.name.toLowerCase())) {
          alert("A product with this name already exists.");
          setSubmittingForm(false);
          return;
        }
        // Add new
        updatedList.push(newItem);
      }

      const { updateItems } = await import("@/app/actions");
      await updateItems(updatedList, user, pass);
      
      setProducts(updatedList);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to update item.");
    } finally {
      setSubmittingForm(false);
    }
  };

  // Handle Item delete
  const handleDeleteItem = async (itemToDelete: any) => {
    if (!confirm(`Are you sure you want to delete "${itemToDelete.name}"?`)) {
      return;
    }

    try {
      const user = sessionStorage.getItem("admin_user") || "";
      const pass = sessionStorage.getItem("admin_pass") || "";

      const updatedList = products.filter((item) => item.name !== itemToDelete.name);

      const { updateItems } = await import("@/app/actions");
      await updateItems(updatedList, user, pass);

      setProducts(updatedList);
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading spinner during check
  if (verifying && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f7f4] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#15803d]"></div>
      </div>
    );
  }

  // Login Form Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f7f4] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-[448px] bg-white rounded-3xl p-8 shadow-[0_12px_40px_rgba(21,128,61,0.06)] border border-[#15803d]/10">
          <div className="text-center mb-6">
            <img 
              alt="Capedo Impex Logo" 
              className="w-16 h-16 object-contain mx-auto mb-3" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh" 
            />
            <h1 className="text-2xl font-extrabold text-[#113a1a]">Capedo Impex</h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Admin Inventory Access</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Username</label>
              <input 
                required
                className="w-full px-4 py-3 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none"
                placeholder="Enter username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Password</label>
              <input 
                required
                className="w-full px-4 py-3 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none"
                placeholder="Enter password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              className="w-full bg-[#15803d] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#166534] transition-all flex items-center justify-center gap-2 mt-6"
              type="submit"
            >
              Verify Credentials
              <span className="material-symbols-outlined text-sm">login</span>
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link className="text-[#15803d] font-bold text-xs hover:underline flex items-center justify-center gap-1" href="/">
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Screen
  return (
    <div className="min-h-screen bg-[#f3f7f4] flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-40 bg-white border-b border-[#e2ece5] shadow-sm h-20">
        <div className="max-w-[1280px] mx-auto h-full flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center gap-2">
            <img 
              alt="Capedo Impex Logo" 
              className="w-10 h-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh" 
            />
            <div>
              <span className="font-extrabold text-[#15803d] text-base md:text-lg block leading-none">Capedo Impex</span>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Admin Console</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all border border-red-200/40 flex items-center gap-1.5"
          >
            Logout
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 max-w-[1280px] w-full mx-auto px-4 md:px-8 flex-grow pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d2dfd5] pb-5 mb-8">
          <div>
            <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#113a1a]">Inventory Management</h1>
            <p className="text-on-surface-variant text-sm mt-1 font-medium">Add, update, or remove organic products from store database</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-[#15803d] text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md hover:bg-[#166534] transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Item
          </button>
        </div>

        {/* Toolbar: Search and Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(21,128,61,0.02)] border border-[#15803d]/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-[448px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#15803d]">search</span>
            <input 
              className="w-full pl-9 pr-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none" 
              placeholder="Search items by name or category..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-xs font-bold text-[#15803d] bg-[#f3f7f4] px-4 py-2 rounded-full self-start md:self-auto">
            Total Database Items: {filteredProducts.length}
          </p>
        </div>

        {/* Products Display (Table on Desktop, Cards on Mobile) */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#15803d]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-[0_4px_25px_rgba(21,128,61,0.04)] border border-[#d2dfd5]/40">
            <span className="material-symbols-outlined text-[#15803d]/40 text-5xl mb-3">inventory_2</span>
            <p className="font-body-md text-on-surface-variant font-medium">No inventory products found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(21,128,61,0.03)] border border-[#15803d]/10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#eef4ef] text-left border-b border-[#d2dfd5]">
                    <th className="px-6 py-4 font-bold text-xs text-[#15803d] uppercase tracking-wider w-24">Image</th>
                    <th className="px-6 py-4 font-bold text-xs text-[#15803d] uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 font-bold text-xs text-[#15803d] uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 font-bold text-xs text-[#15803d] uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 font-bold text-xs text-[#15803d] uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-4 font-bold text-xs text-[#15803d] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f7f4]">
                  {filteredProducts.map((product, index) => (
                    <tr key={product.name + index} className="hover:bg-[#fcfdfc] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-xl bg-[#f3f7f4] border border-[#d2dfd5]/40 overflow-hidden flex items-center justify-center p-1">
                          <img alt={product.name} className="max-w-full max-h-full object-contain" src={product.image_url || "https://placehold.co/100"} />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-[#113a1a]">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#15803d]/10 text-[#15803d]">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-sm text-[#15803d]">
                        {typeof product.price === 'number' || !isNaN(parseFloat(product.price)) 
                          ? `£${product.price}` 
                          : product.price}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-on-surface-variant">
                        {product.discount > 0 ? `${product.discount}% off` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-2 text-[#15803d] hover:bg-[#15803d]/10 rounded-xl transition-colors"
                            title="Edit Product"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Product"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid md:hidden grid-cols-1 gap-4">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.name + index} 
                  className="bg-white p-4 rounded-2xl shadow-[0_4px_15px_rgba(21,128,61,0.02)] border border-[#15803d]/10 flex flex-col gap-3"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#f3f7f4] border border-[#d2dfd5]/40 overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <img alt={product.name} className="max-w-full max-h-full object-contain" src={product.image_url || "https://placehold.co/100"} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-wider bg-[#15803d]/5 px-2 py-0.5 rounded-full inline-block mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-sm text-[#113a1a] truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-extrabold text-sm text-[#15803d]">
                          {typeof product.price === 'number' || !isNaN(parseFloat(product.price)) 
                            ? `£${product.price}` 
                            : product.price}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-[10px] font-bold text-red-600">({product.discount}% off)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-2.5">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="flex-1 py-2 text-[#15803d] hover:bg-[#15803d]/5 border border-[#15803d]/20 rounded-xl transition-colors font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(product)}
                      className="flex-1 py-2 text-red-600 hover:bg-red-50 border border-red-200/40 rounded-xl transition-colors font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* CRUD Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#112415]/30 backdrop-blur-sm" 
            onClick={() => !submittingForm && !uploadingImage && setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-3xl w-full max-w-[512px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#e2ece5] flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#113a1a]">
                {editingItem ? "Edit Product" : "Add New Product"}
              </h3>
              <button 
                className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center" 
                onClick={() => setIsModalOpen(false)}
                disabled={submittingForm || uploadingImage}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form className="p-6 space-y-4 overflow-y-auto flex-grow" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Product Name</label>
                <input 
                  required
                  className="w-full px-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none"
                  placeholder="e.g., Organic Avocados" 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none resize-none"
                  placeholder="Describe freshness, origin, details..." 
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Price (e.g. 30 or Seasonal)</label>
                  <input 
                    required
                    className="w-full px-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none"
                    placeholder="e.g. 30 or Seasonal" 
                    type="text" 
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Discount % (Optional)</label>
                  <input 
                    className="w-full px-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none"
                    placeholder="0" 
                    type="number" 
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Existing Image URL (Optional)</label>
                  <input 
                    className="w-full px-4 py-2.5 bg-[#f3f7f4] border border-[#d2dfd5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 transition-all outline-none text-xs text-on-surface-variant"
                    placeholder="Auto-filled if uploaded" 
                    type="text" 
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Upload New Image</label>
                <div className="relative border-2 border-dashed border-[#d2dfd5] rounded-2xl p-6 text-center hover:border-[#15803d] hover:bg-[#f3f7f4]/40 transition-all cursor-pointer group">
                  <input 
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <span className="material-symbols-outlined text-[#15803d] text-[36px] mb-1 group-hover:scale-110 transition-transform">cloud_upload</span>
                  <p className="text-xs font-bold text-on-surface">
                    {selectedFile ? selectedFile.name : "Click or drag image file here"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1">PNG, JPG, WEBP formats accepted</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#e2ece5]">
                <button 
                  className="flex-1 py-3 border border-[#d2dfd5] text-on-surface-variant font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors" 
                  onClick={() => setIsModalOpen(false)} 
                  type="button"
                  disabled={submittingForm || uploadingImage}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 bg-[#15803d] text-white font-bold text-sm rounded-xl hover:bg-[#166534] transition-colors shadow-md flex items-center justify-center gap-1.5" 
                  type="submit"
                  disabled={submittingForm || uploadingImage}
                >
                  {submittingForm || uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
