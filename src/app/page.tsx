export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6">
      <main className="text-center max-w-md">
        {/* Logo/Icon */}
        <div className="text-6xl mb-6">🍽️🍷</div>
        
        {/* App Name */}
        <h1 className="text-4xl font-semibold text-[#722F37] mb-4">
          PlateAndGrape
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-[#2D2D2D] mb-8">
          Your pocket sommelier. Snap the menu, get perfect pairings.
        </p>
        
        {/* Coming Soon Badge */}
        <div className="inline-block bg-[#722F37] text-white px-6 py-3 rounded-full font-medium">
          Coming Soon
        </div>
        
        {/* Features Preview */}
        <div className="mt-12 space-y-4 text-left">
          <div className="flex items-center gap-3 text-[#2D2D2D]">
            <span className="text-[#C9A962]">📸</span>
            <span>Snap photos of menu &amp; wine list</span>
          </div>
          <div className="flex items-center gap-3 text-[#2D2D2D]">
            <span className="text-[#C9A962]">🎯</span>
            <span>One-tap AI-powered matching</span>
          </div>
          <div className="flex items-center gap-3 text-[#2D2D2D]">
            <span className="text-[#C9A962]">✨</span>
            <span>Personalised to your taste &amp; budget</span>
          </div>
        </div>
      </main>
    </div>
  );
}
