"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { DashboardPreviewSection } from "@/components/dashboard-preview-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";
import { AuthModal } from "@/components/auth-modal";

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "login" | "signup";
  }>({
    isOpen: false,
    mode: "login",
  });

  const openLogin = () => setAuthModal({ isOpen: true, mode: "login" });
  const openSignup = () => setAuthModal({ isOpen: true, mode: "signup" });
  const closeAuth = () => setAuthModal({ isOpen: false, mode: "login" });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLogin={openLogin} onSignup={openSignup} />
      <main className="flex-1">
        <HeroSection onGetStarted={openSignup} />
        <FeaturesSection />
        <DashboardPreviewSection />
        <TestimonialsSection />
        <PricingSection onGetStarted={openSignup} />
      </main>
      <Footer />
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuth}
        onToggleMode={() =>
          setAuthModal((prev) => ({
            ...prev,
            mode: prev.mode === "login" ? "signup" : "login",
          }))
        }
      />
    </div>
  );
}
