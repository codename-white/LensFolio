import { supabase } from '../lib/supabase';
import { Booking, BookingStatus } from '../types';

export const createBooking = async (
  photographerId: string,
  modelId: string,
  startTime: string,
  endTime: string,
  totalPrice: number,
  notes?: string
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        photographer_id: photographerId,
        model_id: modelId,
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice,
        status: 'pending',
        notes,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
};

export const getMyBookings = async (userId: string, role: 'model' | 'photographer'): Promise<Booking[]> => {
  const column = role === 'model' ? 'model_id' : 'photographer_id';
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq(column, userId);

  if (error) throw error;
  return data as Booking[];
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
};

