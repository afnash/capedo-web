"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const categoryMap: Record<string, string> = {
  "fruits": "Fruits",
  "vegetables": "Vegetables",
  // "leaves": "Leaves",
  "root-vegetables": "Root Vegetables",
  "herbs": "Herbs",
  "leafy-greens": "Leafy Greens",
  "flowers": "Flowers"
};

export default function CategoryPage({ params }: { params: any }) {
  const unwrappedParams = React.use(params) as { category: string };
  const slug = unwrappedParams.category;
  const displayName = categoryMap[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1));

  const [products, setProducts] = useState<any[]>([]);
  const [address, setAddress] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { fetchItems, fetchAddress, fetchContact } = await import("@/app/actions");
        const [itemsData, addressData, contactData] = await Promise.all([
          fetchItems(),
          fetchAddress(),
          fetchContact()
        ]);
        
        // Filter by category
        const categoryFiltered = (itemsData || []).filter(
          (item: any) => item.category?.toLowerCase() === displayName.toLowerCase()
        );
        setProducts(categoryFiltered);
        setAddress(addressData);
        setContact(contactData);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [displayName]);

  // Live search filtering
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {Object.keys(categoryMap).map((catSlug) => (
                <Link
                  key={catSlug}
                  className={`font-body-md text-base transition-colors duration-200 py-1 shrink-0 ${
                    slug === catSlug
                      ? "text-[#15803d] border-b-2 border-[#15803d] font-bold"
                      : "text-on-surface-variant hover:text-[#15803d]"
                  }`}
                  href={`/${catSlug}`}
                >
                  {categoryMap[catSlug]}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#15803d]">search</span>
              <input 
                className="pl-9 pr-3 py-2 bg-[#f3f7f4] border border-[#d2dfd5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/20 w-64 outline-none transition-all" 
                placeholder="Search items..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
            {Object.keys(categoryMap).map((catSlug) => (
              <Link
                key={catSlug}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-body-md text-base py-2 border-b border-gray-50 last:border-0 block transition-colors ${
                  slug === catSlug
                    ? "text-[#15803d] font-bold"
                    : "text-on-surface-variant hover:text-[#15803d]"
                }`}
                href={`/${catSlug}`}
              >
                {categoryMap[catSlug]}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content (Full Width Grid, No Sidebar) */}
      <main className="pt-28 max-w-[1280px] w-full mx-auto px-4 md:px-8 flex-grow pb-16">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#d2dfd5] pb-4 mb-8">
          <div>
            <span className="text-[#15803d] font-extrabold text-xs tracking-wider uppercase">Organic Produce</span>
            <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#113a1a] mt-1 leading-tight">
              {displayName}
            </h1>
          </div>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant mt-2 md:mt-0 font-medium">
            {loading ? "Loading..." : `${filteredProducts.length} items matches`}
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#15803d]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-[0_4px_25px_rgba(21,128,61,0.04)] border border-[#d2dfd5]/40">
            <span className="material-symbols-outlined text-[#15803d]/40 text-5xl mb-3">search_off</span>
            <p className="font-body-md text-on-surface-variant font-medium">No products match your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product: any, index: number) => (
              <article 
                key={product.id || index} 
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(21,128,61,0.04)] hover:shadow-[0_12px_32px_rgba(21,128,61,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-[#15803d]/10 hover:border-[#15803d]/30"
              >
                {/* Adjust according to image size - Contain & padded, no cropping */}
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
            {/* Fix width wrapper */}
            <p className="font-caption text-caption text-on-surface-variant max-w-[320px] leading-relaxed">
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
                <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                  {address?.name || "Afnash"}<br />
                  {address?.address || "Kalpetta"}<br />
                  Pincode: {address?.pincode || "673572"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15803d] text-body-md">call</span>
                <p className="font-caption text-caption text-on-surface-variant">
                  Phone: {contact?.phone || address?.phone || "+91 7012509672"}
                </p>
              </div>
              {contact?.whatshapp && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#15803d] text-body-md">chat</span>
                  <p className="font-caption text-caption text-on-surface-variant">
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
            <ul className="space-y-2 text-caption text-on-surface-variant">
              <li><Link className="hover:text-[#15803d] transition-colors" href="/fruits">Fruits Catalog</Link></li>
              <li><Link className="hover:text-[#15803d] transition-colors" href="/vegetables">Vegetables Catalog</Link></li>
              <li><Link className="hover:text-[#15803d] transition-colors" href="/leafy-greens">Leafy Greens Catalog</Link></li>
              <li><Link className="hover:text-[#15803d] transition-colors" href="/">Home Page</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
