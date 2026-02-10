import { Header } from "@/components/landing/Header";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { Mockups } from "@/components/landing/Mockups";
import { CTASection } from "@/components/landing/CTASection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <FeatureCards />
        <Mockups />
        <HowItWorks />
        <AnimatedStats />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
