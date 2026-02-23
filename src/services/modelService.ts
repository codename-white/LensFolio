import { supabase } from '../lib/supabase';
import { ModelProfile, RecommendedLocation } from '../types';

export const getModels = async (): Promise<ModelProfile[]> => {
  const { data, error } = await supabase
    .from('model_details')
    .select(`
      *,
      profiles!inner (
        full_name,
        avatar_url,
        account_status
      )
    `)
    .eq('profiles.account_status', 'approved');

  if (error) throw error;
  
  console.log(`Fetched ${data?.length || 0} models from Supabase`);
  
  return (data || []).map((item, index) => ({
    ...item,
    __type: 'model',
    full_name: (item.profiles as any)?.full_name,
    avatar_url: (item.profiles as any)?.avatar_url,
    latitude: Number(item.latitude) || (13.7563 + (index * 0.005)), // Distribute slightly
    longitude: Number(item.longitude) || (100.5018 + (index * 0.005)),
    location: {
      address: item.location_address || 'Bangkok',
      latitude: Number(item.latitude) || (13.7563 + (index * 0.005)),
      longitude: Number(item.longitude) || (100.5018 + (index * 0.005)),
    }
  })) as any;
};

export const getModelById = async (id: string): Promise<ModelProfile | undefined> => {
  const { data, error } = await supabase
    .from('model_details')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return undefined;

  return {
    ...data,
    full_name: (data.profiles as any)?.full_name,
    avatar_url: (data.profiles as any)?.avatar_url,
    location: {
      address: data.location_address,
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
    }
  } as ModelProfile;
};

export const getRecommendedLocations = async (): Promise<RecommendedLocation[]> => {
  const { data, error } = await supabase
    .from('recommended_locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(item => ({
    ...item,
    __type: 'location'
  })) as any;
};


