'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { CaptureButton } from '@/components/camera/CaptureButton';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { PreferencesForm } from '@/components/preferences/PreferencesForm';
import { RecommendationCarousel } from '@/components/recommendations/RecommendationCarousel';
import { RefinementInput } from '@/components/refinement/RefinementInput';
import { getPreferencesAction, savePreferencesAction } from '@/lib/actions/preferences';
import { generatePairingsAction, refinePairingsAction } from '@/lib/actions/pairings';
import { PreferencesInput, Recommendation, CapturedImages, AppScreen } from '@/types';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const defaultPreferences: PreferencesInput = {
  cuisine_styles: [],
  price_sensitivity: 'moderate',
  allergies: [],
  dislikes: [],
};

export default function PlateAndGrapeApp() {
  const [screen, setScreen] = useState<AppScreen>('capture');
  const [preferences, setPreferences] = useState<PreferencesInput>(defaultPreferences);
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({ menu: [], wineList: [] });
  const [cameraTarget, setCameraTarget] = useState<'menu' | 'wine' | null>(null);
  const [recommendations, setRecommendations] = useState<Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{ menu: string[]; wineList: string[] }>({ menu: [], wineList: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    getPreferencesAction().then((prefs) => {
      if (prefs) {
        setPreferences({
          cuisine_styles: prefs.cuisine_styles || [],
          price_sensitivity: prefs.price_sensitivity || 'moderate',
          allergies: prefs.allergies || [],
          dislikes: prefs.dislikes || [],
        });
      }
    });
  }, []);

  const handleCapture = (type: 'menu' | 'wine') => {
    setCameraTarget(type);
  };

  const handleImageCaptured = (imageData: string) => {
    if (cameraTarget === 'menu') {
      setCapturedImages((prev) => ({ ...prev, menu: [...prev.menu, imageData] }));
    } else if (cameraTarget === 'wine') {
      setCapturedImages((prev) => ({ ...prev, wineList: [...prev.wineList, imageData] }));
    }
    // Don't close camera here - let CameraCapture handle it
  };

  const handleMatch = async () => {
    if (capturedImages.menu.length === 0 || capturedImages.wineList.length === 0) return;

    setLoading(true);
    setError(null);
    setScreen('loading');

    try {
      const result = await generatePairingsAction({
        menuImagesBase64: capturedImages.menu,
        wineListImagesBase64: capturedImages.wineList,
        preferences,
      });

      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations);
        setSessionId(result.sessionId || null);
        setImageUrls({
          menu: result.menuImageUrls || [],
          wineList: result.wineListImageUrls || [],
        });
        setScreen('results');
      } else {
        setError(result.error || 'Failed to generate pairings');
        setScreen('capture');
      }
    } catch (err) {
      console.error('Match error:', err);
      setError('Something went wrong. Please try again.');
      setScreen('capture');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (refinement: string) => {
    if (!sessionId || imageUrls.menu.length === 0 || imageUrls.wineList.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await refinePairingsAction({
        sessionId,
        refinement,
        previousRecommendations: recommendations,
        menuImageUrls: imageUrls.menu,
        wineListImageUrls: imageUrls.wineList,
        preferences,
      });

      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations);
      } else {
        setError(result.error || 'Failed to refine pairings');
      }
    } catch (err) {
      console.error('Refine error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (newPreferences: PreferencesInput) => {
    await savePreferencesAction(newPreferences);
    setPreferences(newPreferences);
  };

  const resetCapture = () => {
    setCapturedImages({ menu: [], wineList: [] });
    setRecommendations([]);
    setSessionId(null);
    setImageUrls({ menu: [], wineList: [] });
    setError(null);
    setScreen('capture');
  };

  // Camera overlay
  if (cameraTarget) {
    return (
      <CameraCapture
        label={cameraTarget === 'menu' ? 'Food Menu' : 'Wine List'}
        onCapture={handleImageCaptured}
        onClose={() => setCameraTarget(null)}
        existingCount={cameraTarget === 'menu' ? capturedImages.menu.length : capturedImages.wineList.length}
      />
    );
  }

  // Loading screen
  if (screen === 'loading') {
    return <LoadingScreen />;
  }

  // Preferences screen
  if (screen === 'preferences') {
    return (
      <PreferencesForm
        initialPreferences={preferences}
        onSave={handleSavePreferences}
        onBack={() => setScreen('capture')}
      />
    );
  }

  // Results screen
  if (screen === 'results') {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* Header */}
        <header className="sticky top-0 bg-[#FAF7F2] border-b border-[#E5E5E5] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={resetCapture}
              className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-[#2D2D2D]" />
            </button>
            <h1 className="text-xl font-semibold text-[#2D2D2D]">Your Pairings</h1>
          </div>
          <button
            onClick={resetCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#722F37] hover:bg-white rounded-full transition-colors"
          >
            <RotateCcw size={16} />
            Start Over
          </button>
        </header>

        {/* Loading overlay for refinement */}
        {loading && (
          <div className="fixed inset-0 bg-[#FAF7F2]/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
            <div className="text-4xl mb-4 animate-bounce">🍷</div>
            <p className="text-[#2D2D2D] font-medium">Refining your pairings...</p>
          </div>
        )}

        {/* Recommendations */}
        <div className="py-4 pb-48">
          {error && (
            <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Success Header */}
          <div className="px-4 mb-4 text-center">
            <p className="text-sm text-[#9B9B9B]">
              <span className="animate-sparkle inline-block">✨</span>
              {' '}Found your perfect pairings{' '}
              <span className="animate-sparkle inline-block" style={{ animationDelay: '0.5s' }}>✨</span>
            </p>
          </div>

          <RecommendationCarousel recommendations={recommendations} />
        </div>

        {/* Refinement Input */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FAF7F2] border-t border-[#E5E5E5]">
          <RefinementInput onRefine={handleRefine} loading={loading} />
        </div>
      </div>
    );
  }

  // Capture screen (default)
  const hasMenuImages = capturedImages.menu.length > 0;
  const hasWineImages = capturedImages.wineList.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#722F37]">PlateAndGrape</h1>
        <button
          onClick={() => setScreen('preferences')}
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <Settings size={24} className="text-[#2D2D2D]" />
        </button>
      </header>

      {/* Preferences hint */}
      {preferences.cuisine_styles.length === 0 && preferences.allergies.length === 0 && (
        <button
          onClick={() => setScreen('preferences')}
          className="mx-4 mb-4 px-4 py-2 bg-[#C9A962]/20 text-[#2D2D2D] rounded-lg text-sm text-left hover:bg-[#C9A962]/30 transition-colors"
        >
          💡 Set your preferences for better matches →
        </button>
      )}

      {/* Error display */}
      {error && (
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 px-4 flex flex-col">
        {/* Capture buttons */}
        <div className="flex gap-4 mb-6">
          <CaptureButton
            label="Food Menu"
            icon="menu"
            images={capturedImages.menu}
            onClick={() => handleCapture('menu')}
          />
          <CaptureButton
            label="Wine List"
            icon="wine"
            images={capturedImages.wineList}
            onClick={() => handleCapture('wine')}
          />
        </div>

        {/* Match button */}
        <Button
          onClick={handleMatch}
          disabled={!hasMenuImages || !hasWineImages}
          size="lg"
          className="w-full"
        >
          Match Now
        </Button>

        {/* Instructions */}
        <div className="mt-8 text-center text-[#9B9B9B]">
          <p className="text-sm">
            {!hasMenuImages && !hasWineImages
              ? 'Take photos of the food menu and wine list'
              : !hasMenuImages
              ? 'Now capture the food menu'
              : !hasWineImages
              ? 'Now capture the wine list'
              : 'Ready to find your perfect pairing!'}
          </p>
          <p className="text-xs mt-1 text-[#9B9B9B]/70">
            Tip: Capture multiple pages if needed
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-[#9B9B9B]">🍽️🍷 Your pocket sommelier</p>
      </footer>
    </div>
  );
}
