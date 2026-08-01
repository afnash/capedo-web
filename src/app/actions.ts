"use server";

import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabase';

// Helper to check credentials safely
function isAuthorized(user: string, pass: string) {
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPass = process.env.ADMIN_PASS || "admin";
  return user === expectedUser && pass === expectedPass;
}

export async function verifyCredentials(user: string, pass: string) {
  return isAuthorized(user, pass);
}

// -------------------------------------------------------------
// ITEMS / PRODUCTS ACTIONS
// -------------------------------------------------------------
export async function fetchItems() {
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error("Supabase items query error, falling back to JSON:", err);
  }

  // Fallback to JSON file
  try {
    const filePath = path.join(process.cwd(), 'data', 'capedo_products.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data || [];
  } catch (error) {
    console.error("Error fetching items from json:", error);
    return [];
  }
}

export async function updateItems(updatedItems: any[], user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  // Try saving to Supabase
  try {
    const { error } = await supabase.from('items').upsert(updatedItems);
    if (error) {
      console.error("Supabase upsert error:", error);
    }
  } catch (err) {
    console.error("Supabase update error:", err);
  }

  // Write to local JSON
  try {
    const filePath = path.join(process.cwd(), 'data', 'capedo_products.json');
    await fs.writeFile(filePath, JSON.stringify(updatedItems, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Error writing items json:", error);
    throw new Error("Failed to save database modifications.");
  }
}

export async function saveItem(item: any, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  const existingItems = await fetchItems();
  let updatedItems = [...existingItems];

  if (item.id) {
    const index = updatedItems.findIndex((i: any) => i.id === item.id || String(i.id) === String(item.id));
    if (index !== -1) {
      updatedItems[index] = { ...updatedItems[index], ...item };
    } else {
      updatedItems.unshift(item);
    }
  } else {
    const newItem = {
      ...item,
      id: Date.now(),
    };
    updatedItems.unshift(newItem);
  }

  return await updateItems(updatedItems, user, pass);
}

export async function deleteItem(id: any, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  try {
    await supabase.from('items').delete().eq('id', id);
  } catch (err) {
    console.error("Error deleting from Supabase:", err);
  }

  const existingItems = await fetchItems();
  const updatedItems = existingItems.filter((i: any) => String(i.id) !== String(id));
  return await updateItems(updatedItems, user, pass);
}

// -------------------------------------------------------------
// ADDRESS ACTIONS
// -------------------------------------------------------------
export async function fetchAddress() {
  try {
    const { data, error } = await supabase.from('address').select('*').limit(1);
    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Supabase address fetch error:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'address.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching address from json:", error);
    return null;
  }
}

export async function updateAddress(addressData: any, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  try {
    await supabase.from('address').upsert([{ id: 1, ...addressData }]);
  } catch (err) {
    console.error("Supabase address update error:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'address.json');
    await fs.writeFile(filePath, JSON.stringify(addressData, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Error writing address json:", error);
    throw new Error("Failed to save address.");
  }
}

// -------------------------------------------------------------
// CONTACT ACTIONS
// -------------------------------------------------------------
export async function fetchContact() {
  try {
    const { data, error } = await supabase.from('contact').select('*').limit(1);
    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Supabase contact fetch error:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching contact from json:", error);
    return null;
  }
}

export async function updateContact(contactData: any, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  try {
    await supabase.from('contact').upsert([{ id: 1, ...contactData }]);
  } catch (err) {
    console.error("Supabase contact update error:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    await fs.writeFile(filePath, JSON.stringify(contactData, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Error writing contact json:", error);
    throw new Error("Failed to save contact.");
  }
}

// -------------------------------------------------------------
// OFFERS ACTIONS
// -------------------------------------------------------------
export async function fetchOffers() {
  try {
    const { data, error } = await supabase.from('offers').select('*').limit(1);
    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {
    console.error("Supabase offers fetch error:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'offers.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching offers from json:", error);
    return null;
  }
}

export async function updateOffers(offersData: any, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  try {
    await supabase.from('offers').upsert([{ id: 1, ...offersData }]);
  } catch (err) {
    console.error("Supabase offers update error:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'offers.json');
    await fs.writeFile(filePath, JSON.stringify(offersData, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Error writing offers json:", error);
    throw new Error("Failed to save offers.");
  }
}

// -------------------------------------------------------------
// BANNERS ACTIONS
// -------------------------------------------------------------
export async function fetchBanners() {
  try {
    const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error("Supabase banners fetch error, falling back to JSON:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'banners.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data || [];
  } catch (error) {
    console.error("Error fetching banners from json:", error);
    return [];
  }
}

export async function saveBanner(banner: any, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  const existingBanners = await fetchBanners();
  let updatedBanners = [...existingBanners];

  const bannerToSave = {
    ...banner,
    id: banner.id || `banner-${Date.now()}`,
    active: banner.active !== undefined ? banner.active : true,
    created_at: banner.created_at || new Date().toISOString(),
  };

  try {
    await supabase.from('banners').upsert([bannerToSave]);
  } catch (err) {
    console.error("Supabase save banner error:", err);
  }

  if (banner.id) {
    const idx = updatedBanners.findIndex((b: any) => String(b.id) === String(banner.id));
    if (idx !== -1) {
      updatedBanners[idx] = bannerToSave;
    } else {
      updatedBanners.unshift(bannerToSave);
    }
  } else {
    updatedBanners.unshift(bannerToSave);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'banners.json');
    await fs.writeFile(filePath, JSON.stringify(updatedBanners, null, 2), 'utf8');
    return { success: true, banner: bannerToSave };
  } catch (error) {
    console.error("Error writing banners json:", error);
    throw new Error("Failed to save banner.");
  }
}

export async function deleteBanner(id: string, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  try {
    await supabase.from('banners').delete().eq('id', id);
  } catch (err) {
    console.error("Supabase delete banner error:", err);
  }

  const existingBanners = await fetchBanners();
  const updatedBanners = existingBanners.filter((b: any) => String(b.id) !== String(id));

  try {
    const filePath = path.join(process.cwd(), 'data', 'banners.json');
    await fs.writeFile(filePath, JSON.stringify(updatedBanners, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Error writing banners json:", error);
    throw new Error("Failed to delete banner.");
  }
}

// -------------------------------------------------------------
// BANNERS BUCKET FILE UPLOAD ACTION
// -------------------------------------------------------------
export async function uploadBannerFile(formData: FormData, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  
  try {
    // Attempt to create bucket 'banners' if it doesn't exist yet
    try {
      await supabase.storage.createBucket('banners', { public: true });
    } catch (_) {
      // Ignore if bucket already exists or permissions restrict createBucket
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('banners')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/png',
        upsert: true
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('banners')
      .getPublicUrl(fileName);

    return { success: true, publicUrl: urlData.publicUrl };
  } catch (err: any) {
    console.error("Upload banner file error:", err);
    throw new Error(err.message || "Failed to upload image to banners bucket");
  }
}
