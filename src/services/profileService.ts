import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
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

/**
 * Uploads an image to Supabase Storage
 * @param bucket Storage bucket name
 * @param path Path within the bucket (e.g., 'avatars/user-id.jpg')
 * @param uri Local file URI from image picker
 */
export const uploadImage = async (bucket: string, path: string, uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
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
