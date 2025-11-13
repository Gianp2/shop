import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper';

import {
  FaExclamationTriangle,
  FaUserCircle,
  FaShippingFast,
  FaQuestionCircle,
  FaSyncAlt,
  FaInfoCircle,
  FaInstagram,
  FaTwitterSquare,
  FaMapMarkerAlt,
  FaTag,
  FaBriefcase,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';

import { useAuthContext } from 'hooks/useAuthContext';
import { Slider } from 'components/common';

import { SLIDES as slides } from './data';

import styles from './index.module.scss';

const ContenidoMenuLateral = ({ toggleSideNav }) => {
  const { isAdmin, isVerified, name } = useAuthContext();

  return (
    <div className={styles.container}>
      {/* Sección de enlaces a productos */}
      <div className={styles.links_container}>
        <ul className={styles.links_list}>
          <h2>Productos</h2>
          <li>
            <Link
              to="/collections/t-shirts"
              onClick={toggleSideNav}
              className={styles.link}
            >
              Remeras
            </Link>
          </li>
          <li>
            <Link
              to="/collections/hoodies-sweatshirts"
              onClick={toggleSideNav}
              className={styles.link}
            >
              Buzos
            </Link>
          </li>
          <li>
            <Link
              to="/collections/accessories"
              onClick={toggleSideNav}
              className={styles.link}
            >
              Accesorios
            </Link>
          </li>
        </ul>

        <ul className={styles.links_list}>
          <h2>Lanzamientos</h2>
          <li>
            <Link
              to="/collections/products"
              onClick={toggleSideNav}
              className={styles.link}
            >
              #001
            </Link>
          </li>
        </ul>
      </div>

      {/* Carrusel de productos o promociones */}
      <div className={styles.products_container}>
        <Slider
          slides={slides}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          centeredSlides={true}
          grabCursor={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          sliderClassName={styles.slider}
          imageFillClassName={styles.image_fill}
          imageClassName={styles.image}
        />
      </div>

      {/* Información del usuario y enlaces de ayuda */}
      <div className={styles.info_container}>
        {isVerified && (
          <h2 className={styles.title}>¡Bienvenido de nuevo, {name}!</h2>
        )}
        <ul className={styles.links_list}>
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                onClick={toggleSideNav}
                className={styles.link}
              >
                <i>
                  <FaExclamationTriangle />
                </i>
                Admin
              </Link>
            </li>
          )}
          <li>
            <Link
              to={isVerified ? '/account' : '/login'}
              onClick={toggleSideNav}
              className={styles.link}
            >
              <i>
                <FaUserCircle />
              </i>
              {isVerified ? 'Mi cuenta' : 'Iniciar sesión'}
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSideNav} className={styles.link}>
              <i>
                <FaQuestionCircle />
              </i>
              Centro de ayuda
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSideNav} className={styles.link}>
              <i>
                <FaTag />
              </i>
              Descuentos
            </Link>
          </li>

          <li>
            <Link to="/" onClick={toggleSideNav} className={styles.link}>
              <i>
                <FaSyncAlt />
              </i>
              Devoluciones y cambios
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSideNav} className={styles.link}>
              <i>
                <FaInfoCircle />
              </i>
              Sobre nosotros
            </Link>
          </li>
        </ul>
      </div>

      {/* Redes sociales */}
      <div className={styles.socials_container}>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
          <FaTiktok />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitterSquare />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">
          <FaYoutube />
        </a>
      </div>
    </div>
  );
};

export default ContenidoMenuLateral;
