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
  let supabaseItems: any[] = [];
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (!error && data && data.length > 0) {
      supabaseItems = data;
    }
  } catch (err) {
    console.error("Supabase items query error, falling back to JSON:", err);
  }

  // Read local JSON file for image_url fallbacks
  try {
    const filePath = path.join(process.cwd(), 'data', 'capedo_products.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const jsonItems = JSON.parse(fileContents) || [];

    if (supabaseItems.length > 0) {
      const jsonMap = new Map(jsonItems.map((j: any) => [j.name.toLowerCase(), j.image_url]));
      return supabaseItems.map((item: any) => ({
        ...item,
        image_url: item.image_url || jsonMap.get(item.name?.toLowerCase()) || null,
      }));
    }
    return jsonItems;
  } catch (error) {
    console.error("Error fetching items from json fallback:", error);
    return supabaseItems;
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

  // Best-effort write to local JSON (gracefully skipped on Vercel read-only filesystem)
  try {
    const filePath = path.join(process.cwd(), 'data', 'capedo_products.json');
    await fs.writeFile(filePath, JSON.stringify(updatedItems, null, 2), 'utf8');
  } catch (_) {}

  return { success: true };
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
  } catch (_) {}

  return { success: true };
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
  } catch (_) {}

  return { success: true };
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
  } catch (_) {}

  return { success: true };
}

// -------------------------------------------------------------
// BANNERS ACTIONS (Stored directly in Supabase Storage Bucket 'banners')
// -------------------------------------------------------------

const BANNERS_BUCKET = 'banners';
const MANIFEST_FILE = 'banners_manifest.json';

// Helper to download the manifest from the banners bucket
async function getStorageBannersManifest(): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage.from(BANNERS_BUCKET).download(MANIFEST_FILE);
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (_) {
    // If manifest doesn't exist yet in bucket, return empty
  }
  return [];
}

// Helper to save the manifest to the banners bucket & local fallback
async function saveStorageBannersManifest(manifest: any[]): Promise<void> {
  const jsonString = JSON.stringify(manifest, null, 2);
  const buffer = Buffer.from(jsonString, 'utf-8');

  try {
    await supabase.storage.from(BANNERS_BUCKET).upload(MANIFEST_FILE, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (err) {
    console.error("Error saving banners manifest to Supabase bucket:", err);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'banners.json');
    await fs.writeFile(filePath, jsonString, 'utf-8');
  } catch (err) {
    console.error("Error saving local banners cache:", err);
  }
}

export async function fetchBanners() {
  try {
    // 1. List all files currently in the Supabase 'banners' bucket
    const { data: files, error: filesError } = await supabase.storage.from(BANNERS_BUCKET).list();

    if (!filesError && Array.isArray(files)) {
      // Filter out non-image files such as banners_manifest.json, folders, etc.
      const imageFiles = files.filter(f => 
        f.name !== MANIFEST_FILE && 
        /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f.name)
      );

      // 2. Fetch the stored manifest from the bucket
      let manifest = await getStorageBannersManifest();

      // Filter out any stale dummy mock items (like old googleusercontent.com URLs or 'banner-1')
      manifest = manifest.filter(b => 
        b && b.image_url && !b.image_url.includes('googleusercontent.com') && b.id !== 'banner-1'
      );

      let manifestChanged = false;

      // 3. For any image present in the bucket that isn't yet in the manifest, add it automatically
      for (const file of imageFiles) {
        const publicUrl = supabase.storage.from(BANNERS_BUCKET).getPublicUrl(file.name).data.publicUrl;
        const existing = manifest.find((b: any) => 
          b.file_name === file.name || 
          b.image_url?.includes(file.name)
        );

        if (!existing) {
          manifest.unshift({
            id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            file_name: file.name,
            title: "",
            subtitle: "",
            cta_text: "Shop Now",
            cta_link: "#explore-categories",
            image_url: publicUrl,
            active: true,
            created_at: file.created_at || new Date().toISOString(),
          });
          manifestChanged = true;
        } else {
          if (!existing.file_name) {
            existing.file_name = file.name;
            manifestChanged = true;
          }
          if (!existing.image_url) {
            existing.image_url = publicUrl;
            manifestChanged = true;
          }
        }
      }

      // 4. Remove manifest items whose image files no longer exist in the bucket
      const validFileNames = new Set(imageFiles.map(f => f.name));
      const filteredManifest = manifest.filter((b: any) => {
        if (b.file_name) {
          return validFileNames.has(b.file_name);
        }
        if (b.image_url && b.image_url.includes(`/storage/v1/object/public/${BANNERS_BUCKET}/`)) {
          const parts = b.image_url.split('/');
          const filename = parts[parts.length - 1];
          return validFileNames.has(filename);
        }
        return true;
      });

      if (filteredManifest.length !== manifest.length || manifestChanged) {
        await saveStorageBannersManifest(filteredManifest);
        return filteredManifest;
      }

      return manifest;
    }
  } catch (err) {
    console.error("Error fetching banners from Supabase storage bucket:", err);
  }

  // Fallback to local data/banners.json (stripping any hardcoded mock banners)
  try {
    const filePath = path.join(process.cwd(), 'data', 'banners.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return (data || []).filter((b: any) => 
      b && b.image_url && !b.image_url.includes('googleusercontent.com') && b.id !== 'banner-1'
    );
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

  // Extract file_name if present or from image_url
  let fileName = banner.file_name;
  if (!fileName && banner.image_url && banner.image_url.includes(`/storage/v1/object/public/${BANNERS_BUCKET}/`)) {
    const parts = banner.image_url.split('/');
    fileName = parts[parts.length - 1];
  }

  const bannerToSave = {
    ...banner,
    id: banner.id || `banner-${Date.now()}`,
    file_name: fileName || banner.file_name,
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    cta_text: banner.cta_text || "Shop Now",
    cta_link: banner.cta_link || "#explore-categories",
    image_url: banner.image_url,
    active: banner.active !== undefined ? banner.active : true,
    created_at: banner.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

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

  await saveStorageBannersManifest(updatedBanners);

  return { success: true, banner: bannerToSave };
}

export async function deleteBanner(id: string, user: string, pass: string) {
  if (!isAuthorized(user, pass)) {
    throw new Error("Unauthorized");
  }

  const existingBanners = await fetchBanners();
  const bannerToDelete = existingBanners.find((b: any) => String(b.id) === String(id));

  // If the banner has an image stored in Supabase 'banners' bucket, delete the file from the bucket
  if (bannerToDelete) {
    let fileName = bannerToDelete.file_name;
    if (!fileName && bannerToDelete.image_url && bannerToDelete.image_url.includes(`/storage/v1/object/public/${BANNERS_BUCKET}/`)) {
      const parts = bannerToDelete.image_url.split('/');
      fileName = parts[parts.length - 1];
    }
    if (fileName) {
      try {
        await supabase.storage.from(BANNERS_BUCKET).remove([fileName]);
      } catch (err) {
        console.error("Error removing file from Supabase banners bucket:", err);
      }
    }
  }

  const updatedBanners = existingBanners.filter((b: any) => String(b.id) !== String(id));
  await saveStorageBannersManifest(updatedBanners);

  return { success: true };
}

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
    try {
      await supabase.storage.createBucket(BANNERS_BUCKET, { public: true });
    } catch (_) {}

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from(BANNERS_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type || 'image/png',
        upsert: true
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(BANNERS_BUCKET)
      .getPublicUrl(fileName);

    return { success: true, publicUrl: urlData.publicUrl, fileName };
  } catch (err: any) {
    console.error("Upload banner file error:", err);
    throw new Error(err.message || "Failed to upload image to banners bucket");
  }
}
