import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

const MediaContainer = ({
  image,
  video,
  autoPlay = false,
  loop = false,
  muted = false,
  to,
  alt = '',
  slugCheck,
  onClick,
  clearPlaceholders,
  containerClassName = '',
  fillClassName = '',
  placeholderClassName = '',
  mediaClassName = '',
}) => {
  const placeholdersCleared = useRef(false);
  const [mediaIsLoading, setMediaIsLoading] = useState(true);
  const [showMediaPlaceHolder, setShowMediaPlaceholder] = useState(true);

  const clearMediaPlaceholder = () => {
    if (clearPlaceholders && !placeholdersCleared.current) {
      placeholdersCleared.current = true;
      clearPlaceholders();
    }
    setShowMediaPlaceholder(false);
    setTimeout(() => setMediaIsLoading(false), 100);
  };

  const renderMedia = () => {
    if (image) {
      return (
        <img
          src={image}
          alt={alt}
          onLoad={clearMediaPlaceholder}
          className={`${styles.image} ${mediaClassName} ${
            !mediaIsLoading ? styles.show : ''
          }`}
          loading="lazy"
        />
      );
    }

    if (video) {
      return (
        <video
          src={video}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          onLoadedData={clearMediaPlaceholder}
          className={`${styles.video} ${mediaClassName} ${
            !mediaIsLoading ? styles.show : ''
          }`}
        />
      );
    }

    return null;
  };

  const content = (
    <div className={`${styles.media_fill} ${fillClassName}`}>
      {mediaIsLoading && (
        <div
          className={`${styles.media_placeholder} ${placeholderClassName} ${
            showMediaPlaceHolder ? '' : styles.hide
          }`}
        />
      )}
      {renderMedia()}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        state={slugCheck ? true : null}
        className={`${styles.media_container} ${containerClassName}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={`${styles.media_container} ${containerClassName}`}>
      {content}
    </div>
  );
};

export default MediaContainer;
