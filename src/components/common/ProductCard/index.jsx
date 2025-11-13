import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from 'swiper';

import { useCart } from 'hooks/useCart';

import QuickAdd from './QuickAdd';
import { Button, Slider } from 'components/common';

import { formatPrice } from 'helpers/format';

import styles from './index.module.scss';

const ProductCard = ({
  productId,
  variantId,
  model,
  color,
  currentPrice,
  actualPrice,
  type,
  discount,
  slides,
  numberOfVariants,
  handleDeleteStart,
  skus,
  isSoldOut,
  allVariants = [],
  nested,
  onTouchStart,
  onTouchEnd,
  expandableClassName,
  onCardPick,
}) => {
  const location = useLocation();
  const isAdmin = location.pathname.split('/')[1] === 'admin';

  const { addItem, isLoading } = useCart();

  // Convertimos slides a objetos con src y url para Slider
  const normalizeSlides = (slidesArray) =>
    Array.isArray(slidesArray)
      ? slidesArray.map((img, index) => ({
          id: index,
          src: img,
          url: '', // puedes agregar url si necesitas link
        }))
      : [];

  const [currentVariant, setCurrentVariant] = useState({
    variantId,
    color,
    currentPrice,
    discount,
    slides: normalizeSlides(slides),
    skus: skus || [],
    isSoldOut,
  });

  const [showDetailsPlaceholder, setDetailsShowPlaceholder] = useState(true);
  const [isSmallContainer, setIsSmallContainer] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setIsSmallContainer(width < 220);
      }
    });

    resizeObserver.observe(containerElement);
    return () => resizeObserver.disconnect();
  }, []);

  const handlePickVariant = ({ variantId }) => {
    const selectedVariant = allVariants.find(
      (variant) => variant.variantId === variantId
    );

    if (!selectedVariant) return;

    setCurrentVariant({
      variantId,
      color: selectedVariant.color,
      currentPrice: selectedVariant.price,
      discount: selectedVariant.discount,
      slides: normalizeSlides(selectedVariant.slides),
      skus: selectedVariant.skus || [],
      isSoldOut: selectedVariant.isSoldOut,
    });
  };

  const handleAddItem = async ({ skuId, size }) => {
    if (!currentVariant.slides?.length) return;

    await addItem({
      skuId,
      productId,
      variantId: currentVariant.variantId,
      size,
      model,
      type,
      color: currentVariant.color,
      price: currentVariant.currentPrice,
      slug: currentVariant.slides[0]?.url || '',
      image: currentVariant.slides[0]?.src || '',
    });
  };

  const allVariantSlides =
    Array.isArray(allVariants) && allVariants.length > 0
      ? allVariants
          .filter((variant) => Array.isArray(variant.slides) && variant.slides.length > 0)
          .map((variant) => ({
            id: variant.variantId,
            src: Array.isArray(variant.slides) ? variant.slides[0] : null,
            url: '',
          }))
      : [];

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${
        isSmallContainer ? styles.is_small_container : ''
      }`}
    >
      {!showDetailsPlaceholder && (
        <div className={styles.tag_container}>
          {currentVariant.isSoldOut && (
            <span className={styles.sold_out}>Sold Out</span>
          )}
          {currentVariant.currentPrice < actualPrice && (
            <span className={styles.discount}>
              -{currentVariant.discount}%
            </span>
          )}
        </div>
      )}

      <div className={styles.slider_container}>
        <Slider
          onCardPick={onCardPick}
          clearPlaceholders={() => setDetailsShowPlaceholder(false)}
          showPlaceholder={showDetailsPlaceholder}
          slides={currentVariant.slides}
          toPage={'/products/'}
          slidesPerView={1}
          spaceBetween={0}
          centeredSlides
          loop
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.image-swiper-button-next',
            prevEl: '.image-swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
          }}
          allowTouchMove={false}
          modules={[Navigation]}
          sliderClassName={styles.slider}
          slideClassName={styles.slide}
          mediaContainerClassName={styles.image_container}
          imageFillClassName={styles.image_fill}
          imageClassName={styles.image}
        />

        {!showDetailsPlaceholder && !isSmallContainer && (
          <QuickAdd
            skus={currentVariant.skus}
            handleAddItem={handleAddItem}
            isLoading={isLoading}
            containerClassName={styles.quick_add_container}
            wrapperClassName={styles.quick_add_wrapper}
            topContainerClassName={styles.quick_add_top}
            bottomContainerClassName={styles.quick_add_bottom}
          />
        )}
      </div>

      <div className={styles.info_wrapper}>
        <div
          className={styles.expandable_container}
          style={{ opacity: showDetailsPlaceholder && 0 }}
        >
          {!isSmallContainer ? (
            <div className={`${styles.expandable} ${expandableClassName}`}>
              <Slider
                clearPlaceholders={() => setDetailsShowPlaceholder(false)}
                onVariantPick={handlePickVariant}
                showPlaceholder={showDetailsPlaceholder}
                slides={allVariantSlides}
                nested={nested}
                slidesPerView="auto"
                spaceBetween={5}
                allowTouchMove
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                sliderClassName={styles.other_variants_slider}
                slideClassName={styles.other_variants_slide}
                mediaContainerClassName={styles.other_variants_image_container}
                imageFillClassName={styles.other_variants_image_fill}
                imageClassName={styles.other_variants_image}
              />
            </div>
          ) : (
            <div className={styles.small_expandable}>
              <QuickAdd
                isSmallContainer
                skus={currentVariant.skus}
                handleAddItem={handleAddItem}
                isLoading={isLoading}
                nested={nested}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                containerClassName={styles.quick_add_container}
                wrapperClassName={styles.quick_add_wrapper}
                topContainerClassName={styles.quick_add_top}
                bottomContainerClassName={styles.quick_add_bottom}
                sizesSliderClassName={styles.sizes_slider}
              />
            </div>
          )}
        </div>

        <ul
          className={styles.info_list}
          style={{ opacity: showDetailsPlaceholder && 1 }}
        >
          {showDetailsPlaceholder ? (
            <>
              <li className={styles.title_placeholder} />
              <li className={styles.color_placeholder} />
              <li className={styles.price_placeholder} />
            </>
          ) : (
            <>
              <li className={styles.title}>
                {model} {type}
              </li>
              <li className={styles.color}>
                <span className={styles.text}>{currentVariant.color}</span>
                {numberOfVariants > 1 && (
                  <span className={styles.tag}>
                    {`${numberOfVariants} colors`}
                  </span>
                )}
              </li>
              <li className={styles.price}>
                {currentVariant.currentPrice < actualPrice ? (
                  <>
                    <span className={styles.discounted_price}>
                      ${formatPrice(currentVariant.currentPrice)}
                    </span>
                    <span className={styles.crossed_price}>
                      ${formatPrice(actualPrice)}
                    </span>
                  </>
                ) : (
                  <span>${formatPrice(currentVariant.currentPrice)}</span>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
