import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import ProductCard from '../ProductCard';

const ProductSlider = ({
  slides = [],
  slidesPerView = 1,
  spaceBetween = 10,
  pagination = false,
  breakpoints,
  allowTouchMove = true,
  sliderClassName = '',
  slideClassName = '',
  cardExpandableClassName = '',
  onCardPick,
}) => {
  const [isNestedBeingDragged, setIsNestedBeingDragged] = useState(false);

  return (
    <Swiper
      breakpoints={breakpoints}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      pagination={pagination}
      allowTouchMove={allowTouchMove}
      noSwiping={isNestedBeingDragged}
      noSwipingClass="swiper-slide"
      modules={[Pagination]}
      className={sliderClassName}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className={slideClassName}>
          {slide.variantId ? (
            <ProductCard
              productId={slide.productId}
              variantId={slide.variantId}
              model={slide.model}
              color={slide.color}
              discount={slide.discount}
              currentPrice={slide.price}
              actualPrice={slide.actualPrice}
              type={slide.type}
              slides={slide.slides}
              images={slide.images}
              numberOfVariants={slide.numberOfVariants}
              skus={slide.skus}
              isSoldOut={slide.isSoldOut}
              allVariants={slide.allVariants}
              nested={true}
              onTouchStart={() => setIsNestedBeingDragged(true)}
              onTouchEnd={() => setIsNestedBeingDragged(false)}
              expandableClassName={cardExpandableClassName}
              onCardPick={onCardPick}
            />
          ) : (
            <div
              style={{
                paddingTop: '168.11965812%',
                background: 'grey',
              }}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSlider;
