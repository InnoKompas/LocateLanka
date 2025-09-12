import {
  Navbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  UseCasesSection,
  CTASection,
  Footer
} from '../components/landing';

export function NewLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  );
}