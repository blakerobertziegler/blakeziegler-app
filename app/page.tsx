import { projects } from '@/lib/projects';
import HeroSection from '@/components/sections/HeroSection';
import ChipSection from '@/components/sections/ChipSection';
import WorkSection from '@/components/sections/WorkSection';
import FooterSection from '@/components/sections/FooterSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ChipSection />
      <WorkSection projects={projects} />
      <FooterSection />
    </main>
  );
}