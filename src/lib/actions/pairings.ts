'use server';

import { getAIProvider } from '@/lib/ai/provider';
import { PreferencesInput, Recommendation } from '@/types';
import { supabase } from '@/lib/db/supabase';

interface GeneratePairingsInput {
  menuImagesBase64: string[];
  wineListImagesBase64: string[];
  preferences: PreferencesInput;
  occasion?: string;
}

interface PairingsResult {
  success: boolean;
  recommendations?: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[];
  sessionId?: string;
  menuImageUrls?: string[];
  wineListImageUrls?: string[];
  error?: string;
}

async function uploadImage(base64Data: string, prefix: string): Promise<string> {
  const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
  const blob = base64ToBlob(base64Data);

  const { error } = await supabase.storage
    .from('captures')
    .upload(fileName, blob, { contentType: 'image/jpeg' });

  if (error) {
    console.error(`Upload error for ${prefix}:`, error);
    throw new Error(`Failed to upload ${prefix} photo. Please check your connection and try again.`);
  }

  const { data: urlData } = supabase.storage.from('captures').getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function generatePairingsAction(input: GeneratePairingsInput): Promise<PairingsResult> {
  try {
    // Upload all menu images
    const menuImageUrls = await Promise.all(
      input.menuImagesBase64.map((img, idx) => uploadImage(img, `menu-${idx}`))
    );

    // Upload all wine list images
    const wineListImageUrls = await Promise.all(
      input.wineListImagesBase64.map((img, idx) => uploadImage(img, `wine-${idx}`))
    );

    // Generate pairings using AI
    const aiProvider = getAIProvider();
    const result = await aiProvider.generatePairings({
      menuImageUrls,
      wineListImageUrls,
      preferences: input.preferences,
      occasion: input.occasion,
    });

    return {
      success: true,
      recommendations: result.recommendations,
      sessionId: result.sessionId,
      menuImageUrls,
      wineListImageUrls,
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
  menuImageUrls: string[];
  wineListImageUrls: string[];
  preferences: PreferencesInput;
}

export async function refinePairingsAction(input: RefinePairingsInput): Promise<PairingsResult> {
  try {
    const aiProvider = getAIProvider();
    const result = await aiProvider.refinePairings({
      sessionId: input.sessionId,
      refinement: input.refinement,
      previousRecommendations: input.previousRecommendations,
      menuImageUrls: input.menuImageUrls,
      wineListImageUrls: input.wineListImageUrls,
      preferences: input.preferences,
    });

    return {
      success: true,
      recommendations: result.recommendations,
      sessionId: result.sessionId,
      menuImageUrls: input.menuImageUrls,
      wineListImageUrls: input.wineListImageUrls,
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
