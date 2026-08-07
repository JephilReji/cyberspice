import { apiClient } from "./client";

export interface Listing {
  _id: string;
  sku: string;
  title: string;
  category: string;
  grade: string;
  description: string;
  harvestDate: string;
  pricePerUnit: number;
  unit: "Kg" | "Gm";
  totalAvailable: number;
  maxPurchaseLimit?: number;
  packagingType: string;
  images: {
    cover?: string;
    macro?: string;
    packaging?: string;
    certification?: string;
  };
  origin?: string;
  featured: boolean;
}

export async function getFeaturedListings() {
  const { data } = await apiClient.get<Listing[]>("/listings/featured");
  return data;
}

export async function getAllListings(search?: string) {
  const params = search ? { search } : {};
  const { data } = await apiClient.get<Listing[]>("/listings", { params });
  return data;
}

export async function getListingById(id: string) {
  const { data } = await apiClient.get<Listing>(`/listings/${id}`);
  return data;
}

export interface CreateListingPayload {
  title: string;
  category: string;
  description: string;
  harvestDate: string;
  pricePerUnit: string;
  unit: "Kg" | "Gm";
  totalAvailable: string;
  maxPurchaseLimit?: string;
  packagingType: string;
  origin?: string;
  cover?: File | null;
  macro?: File | null;
  packaging?: File | null;
  certification?: File | null;
}

export async function createListing(payload: CreateListingPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("harvestDate", payload.harvestDate);
  formData.append("pricePerUnit", payload.pricePerUnit);
  formData.append("unit", payload.unit);
  formData.append("totalAvailable", payload.totalAvailable);
  if (payload.maxPurchaseLimit) formData.append("maxPurchaseLimit", payload.maxPurchaseLimit);
  formData.append("packagingType", payload.packagingType);
  if (payload.origin) formData.append("origin", payload.origin);
  if (payload.cover) formData.append("cover", payload.cover);
  if (payload.macro) formData.append("macro", payload.macro);
  if (payload.packaging) formData.append("packaging", payload.packaging);
  if (payload.certification) formData.append("certification", payload.certification);

  const { data } = await apiClient.post<Listing>("/listings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}