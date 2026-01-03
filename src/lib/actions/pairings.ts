'use server';

import { getAIProvider } from '@/lib/ai/provider';
import { PreferencesInput, Recommendation } from '@/types';
import { supabase } from '@/lib/db/supabase';

interface GeneratePairingsInput {
  menuImageBase64: string;
  wineListImageBase64: string;
  preferences: PreferencesInput;
  occasion?: string;
}

interface PairingsResult {
  success: boolean;
  recommendations?: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[];
  sessionId?: string;
  menuImageUrl?: string;
  wineListImageUrl?: string;
  error?: string;
}

export async function generatePairingsAction(input: GeneratePairingsInput): Promise<PairingsResult> {
  try {
    // Upload images to Supabase Storage
    const menuFileName = `menu-${Date.now()}.jpg`;
    const wineFileName = `wine-${Date.now()}.jpg`;

    // Convert base64 to blob
    const menuBlob = base64ToBlob(input.menuImageBase64);
    const wineBlob = base64ToBlob(input.wineListImageBase64);

    // Upload menu image
    const { error: menuError } = await supabase.storage
      .from('captures')
      .upload(menuFileName, menuBlob, { contentType: 'image/jpeg' });

    if (menuError) {
      console.error('Menu upload error:', menuError);
      throw new Error('Failed to upload menu photo. Please check your connection and try again.');
    }

    // Upload wine list image
    const { error: wineError } = await supabase.storage
      .from('captures')
      .upload(wineFileName, wineBlob, { contentType: 'image/jpeg' });

    if (wineError) {
      console.error('Wine upload error:', wineError);
      throw new Error('Failed to upload wine list photo. Please check your connection and try again.');
    }

    // Get public URLs
    const { data: menuUrl } = supabase.storage.from('captures').getPublicUrl(menuFileName);
    const { data: wineUrl } = supabase.storage.from('captures').getPublicUrl(wineFileName);

    // Generate pairings using AI
    const aiProvider = getAIProvider();
    const result = await aiProvider.generatePairings({
      menuImageUrl: menuUrl.publicUrl,
      wineListImageUrl: wineUrl.publicUrl,
      preferences: input.preferences,
      occasion: input.occasion,
    });

    // Don't delete images yet - we need them for refinement
    // They'll be cleaned up eventually or we can add a cleanup job later

    return {
      success: true,
      recommendations: result.recommendations,
      sessionId: result.sessionId,
      menuImageUrl: menuUrl.publicUrl,
      wineListImageUrl: wineUrl.publicUrl,
    };
  } catch (error) {
    console.error('Generate pairings error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate pairings',
    };
  }
}

interface RefinePairingsInput {
  sessionId: string;
  refinement: string;
  previousRecommendations: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[];
  menuImageUrl: string;
  wineListImageUrl: string;
  preferences: PreferencesInput;
}

export async function refinePairingsAction(input: RefinePairingsInput): Promise<PairingsResult> {
  try {
    const aiProvider = getAIProvider();
    const result = await aiProvider.refinePairings({
      sessionId: input.sessionId,
      refinement: input.refinement,
      previousRecommendations: input.previousRecommendations,
      menuImageUrl: input.menuImageUrl,
      wineListImageUrl: input.wineListImageUrl,
      preferences: input.preferences,
    });

    return {
      success: true,
      recommendations: result.recommendations,
      sessionId: result.sessionId,
      menuImageUrl: input.menuImageUrl,
      wineListImageUrl: input.wineListImageUrl,
    };
  } catch (error) {
    console.error('Refine pairings error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refine pairings',
    };
  }
}

function base64ToBlob(base64: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/jpeg' });
}
