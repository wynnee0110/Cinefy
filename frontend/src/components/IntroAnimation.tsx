import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Immediate mount check to trigger CSS fade-in
    const mountTimer = setTimeout(() => setIsMounted(true), 20);

    // Trigger smooth fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        sessionStorage.setItem("cinefy_intro_seen", "true");
        onComplete?.();
      }, 400); // 400ms fade-out transition
    }, 1000); // 1.0s logo display time

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-400 pointer-events-none select-none ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#000000" }}
    >
      {/* Pure Minimalist Logo Reveal */}
      <div className="relative z-10 flex items-center justify-center px-4">
        <img
          src="/logo.png"
          alt="Cinefy Logo"
          className={`h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-700 ease-out ${
            isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
      </div>
    </div>
  );
}
