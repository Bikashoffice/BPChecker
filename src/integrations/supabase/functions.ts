
import { supabase } from "./client";

/**
 * Safely get the current user's role from profiles table
 * This is used to avoid infinite recursion in RLS policies
 */
export const getCurrentUserRole = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching current user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (err) {
    console.error('Unexpected error getting user role:', err);
    return null;
  }
};
