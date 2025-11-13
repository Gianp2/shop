import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import MediaContainer from '../MediaContainer';
import './sliderStyles.css';

const Slider = ({
  slides = [],
  clearPlaceholders,
  onVariantPick,
  onCardPick,
  showPlaceholder,
  toPage,
  bp,
  slidesPerView,
  spaceBetween,
  loop,
  centeredSlides,
  grabCursor,
  autoplay,
  pagination,
  navigation,
  allowTouchMove = true,
  nested,
  modules,
  onTouchStart,
  onTouchEnd,
  sliderClassName,
  slideClassName,
  mediaContainerClassName,
  imageFillClassName,
  imagePlaceholderClassName,
  imageClassName,
}) => {
  const location = useLocation();

  let slugCheck = false;
  if (toPage && slides.length > 0 && slides[0].url) {
    slugCheck = slides[0].url === location.pathname.split('/')[2];
  }

  if (!slides || slides.length === 0) return null;

  return (
    <Swiper
      breakpoints={bp || undefined}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      loop={loop}
      centeredSlides={centeredSlides}
      grabCursor={grabCursor}
      autoplay={autoplay}
      pagination={pagination}
      navigation={navigation}
      allowTouchMove={allowTouchMove}
      nested={nested}
      modules={modules}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`${sliderClassName || ''} slider-navigation`}
    >
      {navigation && (
        <>
          <div
            className={`swiper-button image-swiper-button-prev ${
              showPlaceholder ? 'no-show' : ''
            }`}
          >
            <FaArrowLeft />
          </div>
          <div
            className={`swiper-button image-swiper-button-next ${
              showPlaceholder ? 'no-show' : ''
            }`}
          >
            <FaArrowRight />
          </div>
        </>
      )}

      {slides.map((slide, index) => (
        <SwiperSlide
          key={slide.id || index}
          className={slideClassName || ''}
          onClick={
            onVariantPick
              ? () => onVariantPick({ variantId: slide.id })
              : onCardPick
              ? onCardPick
              : undefined
          }
        >
          <MediaContainer
            image={slide.src || slide} // si llega string fallback
            to={toPage ? toPage + (slide.url || '') : undefined}
            alt={slide.alt || ''}
            slugCheck={slugCheck}
            clearPlaceholders={clearPlaceholders}
            containerClassName={mediaContainerClassName}
            fillClassName={imageFillClassName}
            placeholderClassName={imagePlaceholderClassName}
            mediaClassName={imageClassName}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
