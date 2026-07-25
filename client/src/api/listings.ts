import { apiClient } from "./client";

export interface Listing {
  _id: string;
  title: string;
  grade: string;
  description: string;
  imageUrl: string;
  pricePerKg: number;
  origin: string;
  featured: boolean;
}

export async function getFeaturedListings() {
  const { data } = await apiClient.get<Listing[]>("/listings/featured");
  return data;
}

export async function getAllListings() {
  const { data } = await apiClient.get<Listing[]>("/listings");
  return data;
}