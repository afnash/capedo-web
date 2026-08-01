"use client";

import React, { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Edit2, Trash2, X, UploadCloud, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formCtaText, setFormCtaText] = useState("Shop Now");
  const [formCtaLink, setFormCtaLink] = useState("#explore-categories");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  const loadBanners = async () => {
    setLoading(true);
    try {
      const { fetchBanners } = await import("@/app/actions");
      const data = await fetchBanners();
      setBanners(data || []);
    } catch (err) {
      console.error("Error loading banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormCtaText("Shop Now");
    setFormCtaLink("#explore-categories");
    setFormImageUrl("");
    setFormActive(true);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: any) => {
    setEditingBanner(banner);
    setFormTitle(banner.title || "");
    setFormSubtitle(banner.subtitle || "");
    setFormCtaText(banner.cta_text || "Shop Now");
    setFormCtaLink(banner.cta_link || "#explore-categories");
    setFormImageUrl(banner.image_url || "");
    setFormActive(banner.active !== undefined ? banner.active : true);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const user = sessionStorage.getItem("admin_user") || "";
    const pass = sessionStorage.getItem("admin_pass") || "";

    try {
      let finalImageUrl = formImageUrl;

      // If a file was selected, upload to Supabase storage bucket 'banners'
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const { uploadBannerFile } = await import("@/app/actions");
        const uploadRes = await uploadBannerFile(formData, user, pass);
        if (uploadRes && uploadRes.publicUrl) {
          finalImageUrl = uploadRes.publicUrl;
        }
      }

      if (!finalImageUrl) {
        throw new Error("Please upload a banner image or specify an image URL.");
      }

      const bannerPayload = {
        id: editingBanner ? editingBanner.id : undefined,
        title: formTitle,
        subtitle: formSubtitle,
        cta_text: formCtaText,
        cta_link: formCtaLink,
        image_url: finalImageUrl,
        active: formActive,
      };

      const { saveBanner } = await import("@/app/actions");
      await saveBanner(bannerPayload, user, pass);

      showToast(editingBanner ? "Banner updated successfully!" : "New banner created in 'banners' bucket!");
      closeModal();
      await loadBanners();
    } catch (err: any) {
      console.error("Failed to save banner:", err);
      showToast(err.message || "Failed to save banner.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (banner: any) => {
    const user = sessionStorage.getItem("admin_user") || "";
    const pass = sessionStorage.getItem("admin_pass") || "";

    try {
      const updated = { ...banner, active: !banner.active };
      const { saveBanner } = await import("@/app/actions");
      await saveBanner(updated, user, pass);
      showToast(`Banner ${updated.active ? 'activated' : 'hidden'} successfully!`);
      await loadBanners();
    } catch (err: any) {
      console.error("Failed to toggle banner status:", err);
      showToast("Failed to update status.");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    const user = sessionStorage.getItem("admin_user") || "";
    const pass = sessionStorage.getItem("admin_pass") || "";

    try {
      const { deleteBanner } = await import("@/app/actions");
      await deleteBanner(id, user, pass);
      showToast("Banner deleted successfully!");
      await loadBanners();
    } catch (err: any) {
      console.error("Failed to delete banner:", err);
      showToast(err.message || "Failed to delete banner.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#113a1a]">Banner Management</h1>
          <p className="text-sm text-[#113a1a]/70 font-medium mt-1">
            Manage promotional hero banners saved in Supabase table and &apos;banners&apos; bucket.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#15803d] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#166534] transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Upload & Add Banner</span>
        </button>
      </div>

      {/* Banners Grid View */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#d2dfd5] p-12 text-center text-gray-500 font-medium">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15803d] mx-auto mb-3"></div>
          Loading banners from Supabase...
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#d2dfd5] p-12 text-center text-gray-500 font-medium space-y-3">
          <ImageIcon size={40} className="mx-auto text-[#15803d]/40" />
          <p className="text-lg font-bold text-[#113a1a]">No Hero Banners Found</p>
          <p className="text-xs text-gray-500">Create your first banner to feature seasonal offers on the homepage.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#15803d] text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            <Plus size={14} /> Add First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border ${
                banner.active ? "border-[#15803d]/30" : "border-gray-200 opacity-80"
              } shadow-sm overflow-hidden flex flex-col justify-between transition-all`}
            >
              {/* Banner Visual Preview Header */}
              <div className="relative h-48 bg-[#e2ece5] overflow-hidden group">
                <img
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  src={banner.image_url}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#15803d] text-white px-2 py-0.5 rounded-md inline-block w-max mb-1">
                    {banner.cta_text || "Featured"}
                  </span>
                  <h3 className="font-extrabold text-lg leading-tight line-clamp-1">{banner.title}</h3>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#113a1a] shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${banner.active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  {banner.active ? 'Active' : 'Hidden'}
                </div>
              </div>

              {/* Banner Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                    {banner.subtitle || "No description provided."}
                  </p>
                  <p className="text-xs font-bold text-[#15803d] mt-2">
                    CTA Link: <span className="text-gray-700 font-normal">{banner.cta_link || "#explore-categories"}</span>
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f0f4f1]">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                      banner.active
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    {banner.active ? "Hide Banner" : "Activate"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 text-gray-500 hover:text-[#15803d] hover:bg-[#e2ece5] rounded-xl transition-all"
                      title="Edit Banner"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Banner"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative border border-[#15803d]/20">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#f0f4f1]">
              <h2 className="font-extrabold text-xl text-[#113a1a]">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Banner Headline Title
                </label>
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Fresh Produce Direct from Farms"
                  className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Banner Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Enter attractive banner description..."
                  className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                    CTA Button Text
                  </label>
                  <input
                    required
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="e.g. Shop Now"
                    className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                    CTA Button Link
                  </label>
                  <input
                    required
                    type="text"
                    value={formCtaLink}
                    onChange={(e) => setFormCtaLink(e.target.value)}
                    placeholder="e.g. #explore-categories or /fruits"
                    className="w-full px-4 py-2.5 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15803d]/30 focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#113a1a] uppercase tracking-wider mb-1">
                  Banner Image (Upload to &apos;banners&apos; bucket or Image URL)
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
                    placeholder="Or paste public banner image URL"
                    className="w-full px-4 py-2 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-xs outline-none focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 text-[#15803d] rounded focus:ring-[#15803d]"
                />
                <label htmlFor="formActive" className="text-xs font-bold text-[#113a1a] cursor-pointer">
                  Display Banner on Homepage (Active)
                </label>
              </div>

              <div className="flex gap-3 pt-3">
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
                      Saving Banner...
                    </>
                  ) : (
                    "Save Banner"
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
