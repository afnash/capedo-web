"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const categories = [
  {
    name: "Fruits",
    slug: "fruits",
    image: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/yellow-banana1.png"
  },
  {
    name: "Vegetables",
    slug: "vegetables",
    image: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/butter-gourd1.png"
  },
  {
    name: "Root Vegetables",
    slug: "root-vegetables",
    image: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/elephant-yam1.png"
  },
  {
    name: "Herbs",
    slug: "herbs",
    image: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/indian-ginger1.png"
  },
  {
    name: "Leafy Greens",
    slug: "leafy-greens",
    image: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/drumstick-leaf1.png"
  },
  {
    name: "Flowers",
    slug: "flowers",
    image: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/arali1.png"
  }
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [address, setAddress] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { fetchItems, fetchBanners, fetchAddress, fetchContact } = await import("@/app/actions");
        const [itemsData, bannersData, addressData, contactData] = await Promise.all([
          fetchItems(),
          fetchBanners(),
          fetchAddress(),
          fetchContact()
        ]);
        setProducts(itemsData || []);
        // Filter only active banners
        const activeBanners = (bannersData || []).filter((b: any) => b.active !== false);
        setBanners(activeBanners);
        setAddress(addressData);
        setContact(contactData);
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto slide banners every 5 seconds if multiple active banners exist
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  // Featured products (first 4 items in database)
  const featuredProducts = products.slice(0, 4);

  // Live search filtering across ALL products
  const searchedProducts = searchQuery.trim() !== ""
    ? products.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : null;

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-[#e2ece5] shadow-sm h-20">
        {/* Desktop Navbar layout */}
        <nav className="hidden md:flex max-w-[1280px] mx-auto h-full justify-between items-center px-4 md:px-8 gap-4">
          <div className="flex items-center gap-8 overflow-hidden">
            <Link className="flex items-center gap-2 group shrink-0" href="/">
              <img
                alt="Capedo Impex Logo"
                className="w-10 h-10 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh"
              />
              <span className="font-headline-md text-headline-md font-extrabold text-[#15803d] whitespace-nowrap">
                Capedo Impex
              </span>
            </Link>
            <div className="flex items-center gap-6 py-2 px-1 whitespace-nowrap">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  className="font-body-md text-base text-on-surface-variant hover:text-[#15803d] transition-colors duration-200 py-1 shrink-0 font-medium"
                  href={`/${cat.slug}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#15803d]">search</span>
              <input
                className="pl-9 pr-3 py-2 bg-[#f3f7f4] border border-[#d2dfd5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 w-64 outline-none transition-all"
                placeholder="Search produce..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link
              href="/admin"
              className="text-xs font-bold text-[#15803d] hover:bg-[#e2ece5] px-3 py-2 rounded-full border border-[#15803d]/30 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Admin
            </Link>
          </div>
        </nav>

        {/* Mobile Navbar layout */}
        <nav className="flex md:hidden max-w-[1280px] mx-auto h-full items-center justify-between px-4 gap-2">
          {isMobileSearchOpen ? (
            /* Mobile Search Mode Header */
            <div className="flex items-center w-full gap-2">
              <button
                onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(""); }}
                className="text-[#15803d] p-1 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#15803d]">search</span>
                <input
                  autoFocus
                  className="pl-9 pr-8 py-2 w-full bg-[#f3f7f4] border border-[#d2dfd5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 outline-none"
                  placeholder="Search produce..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Mobile Standard Mode Header */
            <>
              <Link className="flex items-center gap-2 group shrink-0" href="/">
                <img
                  alt="Capedo Impex Logo"
                  className="w-8 h-8 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh"
                />
                <span className="font-bold text-[#15803d] text-base whitespace-nowrap">
                  Capedo Impex
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setIsMobileSearchOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-[#15803d] p-2 flex items-center justify-center rounded-full hover:bg-[#f3f7f4] transition-colors"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
                <Link
                  href="/admin"
                  className="text-[#15803d] p-2 flex items-center justify-center rounded-full hover:bg-[#f3f7f4] transition-colors"
                  title="Admin Portal"
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-[#15803d] p-2 flex items-center justify-center rounded-full hover:bg-[#f3f7f4] transition-colors"
                >
                  <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
                </button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Drawer Menu */}
        {isMobileMenuOpen && !isMobileSearchOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-[#e2ece5] shadow-md py-4 px-6 md:hidden flex flex-col gap-3 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-xs font-extrabold text-[#15803d]/65 uppercase tracking-wider mb-1 block">Categories</span>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-body-md text-base py-2 border-b border-gray-50 last:border-0 block transition-colors text-on-surface-variant hover:text-[#15803d]"
                href={`/${cat.slug}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="pt-24 flex-grow">
        {searchQuery.trim() !== "" ? (
          /* Live Search Results Section */
          <section className="px-4 md:px-8 py-8 max-w-[1280px] mx-auto w-full">
            <div className="border-b border-[#d2dfd5] pb-4 mb-8">
              <span className="text-[#15803d] font-extrabold text-xs tracking-wider uppercase">Search Results</span>
              <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#113a1a] mt-1 leading-tight">
                Showing results for &quot;{searchQuery}&quot;
              </h1>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant mt-2 font-medium">
                {searchedProducts.length} items found
              </p>
            </div>

            {searchedProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-[0_4px_25px_rgba(21,128,61,0.04)] border border-[#d2dfd5]/40">
                <span className="material-symbols-outlined text-[#15803d]/40 text-5xl mb-3">search_off</span>
                <p className="font-body-md text-on-surface-variant font-medium">No products match your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {searchedProducts.map((product: any, index: number) => (
                  <article
                    key={product.id || index}
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(21,128,61,0.04)] hover:shadow-[0_12px_32px_rgba(21,128,61,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-[#15803d]/10 hover:border-[#15803d]/30"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-white p-3 md:p-4 border-b border-[#f3f7f4] flex items-center justify-center">
                      <img
                        alt={product.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        src={product.image_url || "https://placehold.co/400"}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-[#fcfdfc]">
                      <h2 className="font-bold text-sm md:text-base text-on-surface leading-snug line-clamp-2 group-hover:text-[#15803d] transition-colors">
                        {product.name}
                      </h2>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[#15803d] font-extrabold text-base md:text-lg whitespace-nowrap">
                          {typeof product.price === 'number' || !isNaN(parseFloat(product.price))
                            ? `£${product.price}`
                            : product.price}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Normal Home Page Layout */
          <>
            {/* Dynamic Supabase Hero Banner Section */}
            <section className="px-4 md:px-8 py-6 max-w-[1280px] mx-auto w-full">
              <div className="relative w-full h-[320px] md:h-[420px] rounded-[32px] overflow-hidden bg-[#e2ece5] group border border-[#15803d]/10">
                {currentBanner ? (
                  <>
                    <div className="absolute inset-0 flex items-center z-20">
                      <div className="relative px-6 md:px-12 max-w-[540px]">
                        <span className="bg-[#15803d] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider inline-block mb-3">
                          SPECIAL PROMOTION
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#113a1a] mb-3 leading-tight">
                          {currentBanner.title}
                        </h1>
                        <p className="text-sm md:text-base text-[#113a1a]/80 mb-6 max-w-[420px] leading-relaxed font-medium line-clamp-3">
                          {currentBanner.subtitle}
                        </p>
                        <button
                          onClick={() => {
                            if (currentBanner.cta_link && currentBanner.cta_link.startsWith("#")) {
                              const target = document.getElementById(currentBanner.cta_link.substring(1));
                              if (target) target.scrollIntoView({ behavior: "smooth" });
                            } else if (currentBanner.cta_link) {
                              window.location.href = currentBanner.cta_link;
                            } else {
                              const target = document.getElementById("explore-categories");
                              if (target) target.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="bg-[#15803d] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#166534] transition-all flex items-center gap-2"
                        >
                          {currentBanner.cta_text || "Shop Now"}
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                    {/* Background visual */}
                    <div className="absolute top-0 right-0 h-full w-full md:w-2/3 overflow-hidden pointer-events-none z-10">
                      <img
                        alt={currentBanner.title}
                        className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
                        src={currentBanner.image_url}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e2ece5] via-[#e2ece5]/90 to-transparent z-10"></div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center z-20">
                      <div className="relative px-6 md:px-12 max-w-[500px]">
                        <span className="bg-[#15803d] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider inline-block mb-3">
                          SEASONAL SPECIAL
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#113a1a] mb-3 leading-tight">
                          Harvest Moon <br />Festival Offer
                        </h1>
                        <p className="text-sm md:text-base text-[#113a1a]/80 mb-6 max-w-[360px] leading-relaxed font-medium">
                          Celebrate the season with 30% off on all Capedo Impex organic farm-fresh selections. Straight from our soil to your doorstep.
                        </p>
                        <button
                          onClick={() => {
                            const target = document.getElementById("explore-categories");
                            if (target) target.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-[#15803d] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#166534] transition-all flex items-center gap-2"
                        >
                          Shop Now
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 h-full w-full md:w-2/3 overflow-hidden pointer-events-none z-10">
                      <img
                        alt="Vibrant organic produce"
                        className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0ovYpvWpHJewCSCwZqpNQUK728cFh6HhOJMH4PPSxAbJQ3JIz_2re9UXS81vUhZPi4SEh0rtCX1wfVASwj-Tu0Aae1ne6qCFKmWlfJHGLZW7SfSCsYvWqd1-Dfb5pVwToiKfnBrQXkklS0kgdMEFfRDTvW-u_vSsjYkwgVYCL214ZG3aXb43Kr0mvxgWl81r5UQMwA-3yVkaoBjRekPFYtRytp7Ygwfbm36WIlnsuGFUOL_NqiEG5tY4Vm2Qa42XVEZD3CFqA5614"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e2ece5] via-[#e2ece5]/90 to-transparent z-10"></div>
                  </>
                )}

                {/* Banner Carousel Indicator Dots */}
                {banners.length > 1 && (
                  <div className="absolute bottom-4 left-6 md:left-12 z-30 flex items-center gap-2">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentBannerIndex ? "w-6 bg-[#15803d]" : "w-2 bg-[#15803d]/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Categories Grid */}
            <section id="explore-categories" className="px-4 md:px-8 py-8 max-w-[1280px] mx-auto w-full">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#113a1a]">Explore Categories</h2>
                  <p className="text-on-surface-variant text-sm mt-1 font-medium">Curated fresh picks for your daily needs at Capedo Impex</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <Link
                    href={`/${cat.slug}`}
                    key={cat.slug}
                    className="flex flex-col items-center gap-3 p-3 bg-white rounded-2xl shadow-[0_4px_15px_rgba(21,128,61,0.03)] border border-[#15803d]/5 hover:border-[#15803d]/20 hover:shadow-[0_8px_24px_rgba(21,128,61,0.08)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-16 h-16 md:w-20 md:y-20 rounded-xl bg-[#f3f7f4] flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                      <img
                        alt={cat.name}
                        className="max-w-full max-h-full object-contain"
                        src={cat.image}
                      />
                    </div>
                    <span className="font-label-md text-xs md:text-sm text-on-surface group-hover:text-[#15803d] font-bold transition-colors text-center">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="px-4 md:px-8 py-8 max-w-[1280px] mx-auto w-full">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#113a1a]">Weekly Featured</h2>
                <p className="text-on-surface-variant text-sm mt-1 font-medium">Handpicked premium selections from Capedo Impex partners</p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15803d]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {featuredProducts.map((product: any, index: number) => (
                    <article
                      key={product.id || index}
                      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(21,128,61,0.04)] hover:shadow-[0_12px_32px_rgba(21,128,61,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-[#15803d]/10 hover:border-[#15803d]/30"
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-white p-3 md:p-4 border-b border-[#f3f7f4] flex items-center justify-center">
                        <img
                          alt={product.name}
                          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                          src={product.image_url || "https://placehold.co/400"}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-[#fcfdfc]">
                        <h2 className="font-bold text-sm md:text-base text-on-surface leading-snug line-clamp-2 group-hover:text-[#15803d] transition-colors">
                          {product.name}
                        </h2>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-[#15803d] font-extrabold text-base md:text-lg whitespace-nowrap">
                            {typeof product.price === 'number' || !isNaN(parseFloat(product.price))
                              ? `£${product.price}`
                              : product.price}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#eef4ef] border-t border-[#d2dfd5]/60 mt-auto">
        <div className="max-w-[1280px] mx-auto py-12 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                alt="Capedo Impex Logo"
                className="w-8 h-8 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1scmpnuL34IXeQ5fOAEZBDYkfJBJMy4dSmdVOuqCKOatdCr4oawuJzdKRo1k1-JYC1iCSEnyxBSKfZwV2dAedOXX25cYWfhg55JDO_aE-jNvKEON9pt9Wg2JDjceGAEYPXiHqlhmOqETJD9761qgBIFud62X-O09hn2N4SRPBAxqevclzvxSeaXE2hVWvWlA_m9tzMSEVdKFPy2dk-eQa7A0YU1FVa5lt884cni4bL-feaT0Iiz-7Yxdw5mu4JdXpwLw4-pcmoKjh"
              />
              <span className="font-headline-sm text-headline-sm font-extrabold text-[#15803d]">Capedo Impex</span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant max-w-[320px] leading-relaxed font-medium">
              Organic Minimalism for Daily Essentials. We deliver the freshest produce straight from local farms to your doorstep.
            </p>
            <p className="font-caption text-caption text-on-surface-variant opacity-70">
              © 2026 Capedo Impex. All rights reserved.
            </p>
          </div>

          {/* Column 2: Delivery & Contact */}
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-[#15803d] uppercase tracking-wider font-extrabold">
              Delivery & Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#15803d] text-body-md mt-0.5">location_on</span>
                <p className="font-caption text-caption text-on-surface-variant leading-relaxed font-medium">
                  {address?.name || "Capedo Impex Ltd"}<br />
                  {address?.address || "124 City Road, London"}<br />
                  Pincode: {address?.pincode || "EC1V 2NX"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15803d] text-body-md">call</span>
                <p className="font-caption text-caption text-on-surface-variant font-medium">
                  Phone: {contact?.phone || address?.phone || "+44 7767 969365"}
                </p>
              </div>
              {contact?.whatshapp && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#15803d] text-body-md">chat</span>
                  <p className="font-caption text-caption text-on-surface-variant font-medium">
                    WhatsApp: {contact.whatshapp}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-[#15803d] uppercase tracking-wider font-extrabold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-caption text-on-surface-variant font-medium">
              <li><Link className="hover:text-[#15803d] transition-colors" href="/fruits">Fruits Catalog</Link></li>
              <li><Link className="hover:text-[#15803d] transition-colors" href="/vegetables">Vegetables Catalog</Link></li>
              <li><Link className="hover:text-[#15803d] transition-colors" href="/leafy-greens">Leafy Greens Catalog</Link></li>
              <li><Link className="hover:text-[#15803d] transition-colors" href="/admin">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
