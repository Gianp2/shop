import HeroSection from './HeroSection';
import ProductSliderSection from './ProductSliderSection';
import SlideshowSection from './SlideshowSection';
import CollectionsSection from './CollectionsSection';

export const HomePage = () => {
  return (
    <>
      <SlideshowSection />

      <ProductSliderSection
        titleBottom="Nuevas Llegadas"
        sortBy={{ field: 'price', direction: 'desc' }}
      />

      <CollectionsSection />

      <ProductSliderSection
        titleTop="Todos los días"
        titleBottom="Esenciales"
        sortBy={{ field: 'createdAt', direction: 'asc' }}
      />

      <HeroSection />
    </>
  );
};

export default HomePage;
