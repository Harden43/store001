import HeroSection from '../components/home/HeroSection';
import MarqueeStrip from '../components/home/MarqueeStrip';
import FeaturedCollection from '../components/home/FeaturedCollection';
import BrandStory from '../components/home/BrandStory';
import Categories from '../components/home/Categories';
import Newsletter from '../components/home/Newsletter';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <HeroSection />
      <MarqueeStrip />
      <FeaturedCollection />
      <BrandStory />
      <Categories />
      <Newsletter />
    </>
  );
}
