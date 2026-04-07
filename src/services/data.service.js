import { supabase } from '../lib/supabase';

class DataService {
  /**
   * DESTINATIONS
   */
  async getDestinations() {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async getDestinationBySlug(slug) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }

  async addDestination(destination) {
    const { data, error } = await supabase
      .from('destinations')
      .insert([destination])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * HOTELS
   */
  async getHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async getHotelBySlug(slug) {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }

  async addHotel(hotel) {
    const { data, error } = await supabase
      .from('hotels')
      .insert([hotel])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * RESTAURANTS
   */
  async getRestaurants() {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async getRestaurantBySlug(slug) {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }

  async addRestaurant(restaurant) {
    const { data, error } = await supabase
      .from('restaurants')
      .insert([restaurant])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  /**
   * USER & PROFILE MANAGEMENT
   */
  async getProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, is_blocked, blocked_until, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Dashboard Fetch Warning:", e);
      return []; // Return empty list on failure to prevent app crash
    }
  }

  async updateProfileRole(userId, role) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select('id, email, role, is_blocked, blocked_until, created_at');
    
    if (error) throw error;
    return data[0];
  }

  async updateProfileStatus(userId, is_blocked) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_blocked, blocked_until: null }) // Clearing timed block if permanent block is toggled
      .eq('id', userId)
      .select('id, email, role, is_blocked, blocked_until, created_at');
    
    if (error) throw error;
    return data[0];
  }

  async updateBlockedUntil(userId, durationHours) {
    let blockedUntil = null;
    if (durationHours > 0) {
       blockedUntil = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
          blocked_until: blockedUntil,
          is_blocked: false // Timed block is not a permanent block
      })
      .eq('id', userId)
      .select('id, email, role, is_blocked, blocked_until, created_at');
    
    if (error) throw error;
    return data[0];
  }

  async uploadFile(file, bucket = 'destinations') {
    if (!file) return null;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
           if (uploadError.message.includes('Bucket not found')) {
              throw new Error("Vault Storage Protocol Fault: Please create a 'destinations' bucket in your Supabase Storage dashboard and set it to 'Public'.");
           }
           throw uploadError;
        }

        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (err) {
        // Advanced Steering: Quiet known policy errors to keep console professional
        if (!err.message?.includes('row-level security policy')) {
            console.error("Vault Operational Fault:", err);
        }
        throw err;
    }
  }

  async syncProfile(user) {
     if (!user) return null;
     // Ultimate Fail-Safe Flush: Minimal traffic to solve fetch errors
     try {
       const { data, error } = await supabase
         .from('profiles')
         .upsert([{ id: user.id, email: user.email }], { onConflict: 'id' })
         .select('id, role')
         .single();
       
       if (error) {
          console.error("Profile Sync Warning:", error);
          return { id: user.id, role: 'user' }; // Guaranteed return
       }
       return data;
     } catch (e) {
        return { id: user.id, role: 'user' }; // Absolute fail-safe
     }
  }
}

export const dataService = new DataService();
