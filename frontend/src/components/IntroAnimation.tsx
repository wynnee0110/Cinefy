import { useEffect, useState } from "react";

export default function IntroAnimation() {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return !sessionStorage.getItem("cinefy_intro_seen");
    } catch {
      return true;
    }
  });
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Trigger smooth fade-in after mounting
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 20);

    // Trigger fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1000);

    // Hide completely and set sessionStorage flag
    const hideTimer = setTimeout(() => {
      try {
        sessionStorage.setItem("cinefy_intro_seen", "true");
      } catch (err) {
        console.error("Session storage error:", err);
      }
      setIsVisible(false);
    }, 1400);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []); // Empty dependency array ensures timers run ONCE without premature cleanup resets

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-400 pointer-events-none select-none ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#000000" }}
    >
      {/* Minimalist Logo Reveal */}
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
