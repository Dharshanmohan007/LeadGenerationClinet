import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import HeroSection from '../../components/landing/HeroSection';
import BenefitsSection from '../../components/landing/BenefitsSection';
import HowItWorks from '../../components/landing/HowItWorks';
import WhyChooseUs from '../../components/landing/WhyChooseUs';
import FAQSection from '../../components/landing/FAQSection';
import FinalCTA from '../../components/landing/FinalCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <HowItWorks />
      <WhyChooseUs />
      <FAQSection />
      <FinalCTA />

      {/* Mobile Sticky CTA Bar matching prototype mobile UX */}
      <div className="sticky bottom-0 z-30 border-t border-lf-line bg-white/95 px-4 py-2.5 backdrop-blur-md md:hidden">
        <Button to="/apply" fullWidth size="md">
          Start personal loan enquiry
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
