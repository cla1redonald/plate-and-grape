'use server';

import { getPreferences, savePreferences, defaultPreferences } from '@/lib/db/queries';
import { PreferencesInput } from '@/types';

export async function getPreferencesAction() {
  try {
    const preferences = await getPreferences();
    return preferences || { ...defaultPreferences, id: '', user_id: '', created_at: '', updated_at: '' };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { ...defaultPreferences, id: '', user_id: '', created_at: '', updated_at: '' };
  }
}

export async function savePreferencesAction(preferences: PreferencesInput) {
  try {
    const saved = await savePreferences(preferences);
    return { success: true, data: saved };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error: 'Failed to save preferences' };
  }
}
