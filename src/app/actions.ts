"use server";

import fs from 'fs/promises';
import path from 'path';

export async function fetchItems() {
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

export async function fetchAddress() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'address.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching address from json:", error);
    return null;
  }
}

export async function fetchContact() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching contact from json:", error);
    return null;
  }
}

export async function verifyCredentials(user: string, pass: string) {
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
}

export async function updateItems(updatedItems: any[], user: string, pass: string) {
  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    throw new Error("Unauthorized");
  }
  try {
    const filePath = path.join(process.cwd(), 'data', 'capedo_products.json');
    await fs.writeFile(filePath, JSON.stringify(updatedItems, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Error writing items json:", error);
    throw new Error("Failed to save database modifications.");
  }
}
