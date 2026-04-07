import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Initialize session on startup
      initSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          const { dataService } = await import('../services/data.service');
          const profile = await dataService.syncProfile(user);
          set({ user, profile, token: session.access_token, isAuthenticated: !!session });
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
              }
            }
          });
          
          if (error) throw error;
          
          if (data?.user) {
             const { dataService } = await import('../services/data.service');
             await dataService.syncProfile(data.user);
             if (data.session) {
                set({ user: data.user, token: data.session.access_token, isAuthenticated: true });
             }
             return { success: true, message: data.session ? 'Registered successfully!' : 'Please check your email to verify your account.' };
          }
          
          return { success: true, message: 'Please check your email.' };
        } catch (error) {
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          const { dataService } = await import('../services/data.service');
          const profile = await dataService.syncProfile(data.user);

          // Check if blocked permanently
          if (profile?.is_blocked) {
             await supabase.auth.signOut();
             throw new Error('Your account has been permanently restricted by the administrator.');
          }

          // Check if blocked temporarily (Timed Block)
          if (profile?.blocked_until) {
             const untilDate = new Date(profile.blocked_until);
             if (untilDate > new Date()) {
                await supabase.auth.signOut();
                const diffMs = untilDate.getTime() - Date.now();
                const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
                throw new Error(`Your account is temporarily restricted. Please try again in about ${diffHours} hour(s).`);
             }
          }

          set({ user: data.user, profile, token: data.session.access_token, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          // Deep cleansing of state for multi-user sharing
          set({ user: null, profile: null, token: null, isAuthenticated: false, isLoading: false });
          // Ensure local persistence is also wiped clean
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.error("Logout Warning:", error);
          // Fallback forced cleansing
          set({ user: null, profile: null, token: null, isAuthenticated: false });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (userData) => set({ user: userData }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, token: state.token }),
    }
  )
);
