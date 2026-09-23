import PublicNavbar from '../../components/public/PublicNavbar';
import HeroSection from '../../components/public/HeroSection';
import TentangKamiSection from '../../components/public/TentangKamiSection';
import ServicesSection from '../../components/public/ServicesSection';
import JadwalPenjemputanSection from '../../components/public/JadwalPenjemputanSection';
import TestimonialsSection from '../../components/public/TestimonialsSection';
import CtaSection from '../../components/public/CtaSection';
import PublicFooter from '../../components/public/PublicFooter';

export default function Landing() {
  return (
    <div className="bg-slate-950">
      <PublicNavbar />
      <HeroSection />
      <TentangKamiSection />
      <ServicesSection />
      <JadwalPenjemputanSection />
      <TestimonialsSection />
      <CtaSection />
      <PublicFooter />
    </div>
  );
}