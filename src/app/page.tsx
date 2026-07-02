import { Hero } from '@/components/home/hero';
import { LatestNews } from '@/components/home/latest-news';
import { UpcomingEvents } from '@/components/home/upcoming-events';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { StatsStrip } from '@/components/home/stats-strip';
import { SponsorsStrip } from '@/components/home/sponsors-strip';
import { WaveformDivider } from '@/components/shared/waveform-divider';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <UpcomingEvents />
      <WaveformDivider className="container h-6 opacity-20" />
      <LatestNews />
      <GalleryPreview />
      <SponsorsStrip />
    </>
  );
}
