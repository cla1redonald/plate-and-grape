import { supabase } from './supabase';
import { Preferences, PreferencesInput } from '@/types';

// For v1, we use a default user ID since there's no auth yet
// This will be replaced with actual auth in v2
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function getOrCreateUser(): Promise<string> {
  // Check if default user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', DEFAULT_USER_ID)
    .single();

  if (existingUser) {
    return existingUser.id;
  }

  // Create default user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ id: DEFAULT_USER_ID })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }

  return newUser.id;
}

export async function getPreferences(userId: string = DEFAULT_USER_ID): Promise<Preferences | null> {
  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching preferences:', error);
    throw new Error('Failed to fetch preferences');
  }

  return data;
}

export async function savePreferences(
  preferences: PreferencesInput,
  userId: string = DEFAULT_USER_ID
): Promise<Preferences> {
  // Ensure user exists
  await getOrCreateUser();

  // Check if preferences exist
  const existing = await getPreferences(userId);

  if (existing) {
    // Update existing preferences
    const { data, error } = await supabase
      .from('preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }

    return data;
  } else {
    // Insert new preferences
    const { data, error } = await supabase
      .from('preferences')
      .insert({
        user_id: userId,
        ...preferences,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating preferences:', error);
      throw new Error('Failed to create preferences');
    }

    return data;
  }
}

// Default preferences for new users
export const defaultPreferences: PreferencesInput = {
  cuisine_styles: [],
  price_sensitivity: 'moderate',
  allergies: [],
  dislikes: [],
};
