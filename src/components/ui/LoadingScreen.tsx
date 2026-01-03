'use client';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center p-6 z-40">
      <div className="text-6xl mb-6 animate-bounce">🍷</div>
      <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2">
        Finding your perfect pairing...
      </h2>
      <p className="text-[#9B9B9B] text-center mb-6">
        Analysing menu and wine list
      </p>
      <div className="w-64 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
        <div className="h-full bg-[#722F37] rounded-full animate-pulse w-2/3" />
      </div>
    </div>
  );
}
