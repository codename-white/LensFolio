
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
}

export interface UpdateModelDetailsData {
  bio?: string;
  hourly_rate?: number;
  location_address?: string;
  portfolio_images?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ProfileData {
  full_name?: string;
  avatar_url?: string;
}

/**
 * Uploads an image to Supabase Storage
 */
export const uploadImage = async (bucket: string, path: string, uri: string): Promise<string> => {
  try {
    // Robust approach: Fetch the local URI as a blob and convert to base64
    // This is the most compatible way in Expo 54
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Format: data:image/jpeg;base64,/9j/4AAQ... -> extract only base64 part
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Updates basic profile info
 */
export const updateProfile = async (userId: string, data: UpdateProfileData) => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
};

/**
 * Updates detailed model info
 */
export const updateModelDetails = async (userId: string, data: UpdateModelDetailsData) => {
  const { error } = await supabase
    .from('model_details')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
};

/**
 * Fetches current user's full model details for editing
 */
export const getMyModelDetails = async (userId: string) => {
  const { data, error } = await supabase
    .from('model_details')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore not found
  return data;
};
