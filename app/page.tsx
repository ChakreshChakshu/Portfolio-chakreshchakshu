import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { heroData } from '@/data/hero';

export default function Home() {
  return <MinimalistHero {...heroData} />;
}
