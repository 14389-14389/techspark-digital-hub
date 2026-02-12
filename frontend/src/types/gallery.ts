import api from './api';
import { GalleryImage, GalleryCategory, ServiceCategory } from '../types/gallery';

// Get all categories with image counts
export const getGalleryCategories = async (): Promise<GalleryCategory[]> => {
  try {
    const response = await api.get('/gallery/categories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

// Get gallery images with filtering
export const getGalleryImages = async (
  category: ServiceCategory = 'all',
  featured?: boolean,
  limit: number = 50
): Promise<GalleryImage[]> => {
  try {
    let url = `/gallery/?category=${category}&limit=${limit}`;
    if (featured !== undefined) {
      url += `&featured=${featured}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    return [];
  }
};

// Get single image by ID
export const getGalleryImageById = async (imageId: string): Promise<GalleryImage | null> => {
  try {
    const response = await api.get(`/gallery/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return null;
  }
};

// Like an image
export const likeGalleryImage = async (imageId: string): Promise<number | null> => {
  try {
    const response = await api.post(`/gallery/${imageId}/like`);
    return response.data.likes;
  } catch (error) {
    console.error('Failed to like image:', error);
    return null;
  }
};

// Get featured images
export const getFeaturedImages = async (limit: number = 10): Promise<GalleryImage[]> => {
  return getGalleryImages('all', true, limit);
};

// Get images by specific category
export const getImagesByCategory = async (
  category: ServiceCategory,
  limit: number = 50
): Promise<GalleryImage[]> => {
  return getGalleryImages(category, undefined, limit);
};