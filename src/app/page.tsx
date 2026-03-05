import Header from '@/components/Header';
import Hero from '@/components/Hero';
import OrbitPillars from '@/components/OrbitPillars';
import TransformationCycle from '@/components/TransformationCycle';
import ServicesTabs from '@/components/ServicesTabs';
import Credibility from '@/components/Credibility';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <OrbitPillars />
      <TransformationCycle />
      <ServicesTabs />
      <Credibility />
      <Footer />
    </>
  );
}
