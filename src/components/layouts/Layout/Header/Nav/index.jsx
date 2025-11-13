import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuthContext } from 'hooks/useAuthContext';

import { RiMenuLine } from 'react-icons/ri';
import { CgSearch } from 'react-icons/cg';

import CartIcon from './CartIcon';
import { Button } from 'components/common';

import LogoNav from 'assets/images/logo-nav.png';
import styles from './index.module.scss';

const Navbar = ({ toggleSideNav, openCartModal }) => {
  const { pathname } = useLocation();
  const { isVerified, isAdmin } = useAuthContext();

  const [haDesplazado, setHaDesplazado] = useState(false);

  // Cambiar tamaño del navbar al hacer scroll
  const redimensionarEncabezadoAlDesplazar = () => {
    setHaDesplazado((haDesplazado) => {
      if (
        !haDesplazado &&
        (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
      ) return true;

      if (
        haDesplazado &&
        document.body.scrollTop < 4 &&
        document.documentElement.scrollTop < 4
      ) return false;

      return haDesplazado;
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', redimensionarEncabezadoAlDesplazar);
    return () =>
      window.removeEventListener('scroll', redimensionarEncabezadoAlDesplazar);
  }, []);

  const manejarAperturaModalCarrito = () => {
    if (pathname !== '/cart') {
      openCartModal();
    }
  };

  const estilosNav = haDesplazado
    ? `${styles.nav} ${styles.hasScrolled}`
    : styles.nav;

  // Función genérica para scroll suave a sección
  const scrollToSection = (id) => {
    const element = document.querySelector(`#${id}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // ajustar según altura navbar
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className={estilosNav}>
      {/* Parte superior */}
      <div className={styles.container_top}>
        <Button className={`${styles.link} ${styles.info_link}`} type="button">
          Info
        </Button>

        <ul className={styles.info_list}>
          <li>
            <Link className={styles.link} to="/">
              Centro de Ayuda
            </Link>
          </li>
          <li>
            <Link className={styles.link} to="/">
              Contáctanos
            </Link>
          </li>
          <li>
            <Link className={styles.link} to="/">
              Devoluciones y Cambios
            </Link>
          </li>
        </ul>

        {!isVerified && (
          <Link to="/account/login" className={`${styles.link} ${styles.login_link}`}>
            Iniciar
          </Link>
        )}
        {isVerified && (
          <Link to="/account" className={`${styles.link} ${styles.login_link}`}>
            Mi Cuenta
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className={`${styles.link} ${styles.login_link}`}>
            Admin
          </Link>
        )}
      </div>

      {/* Parte inferior */}
      <div className={styles.container_bottom}>
        <Link to="/">
          <img className={styles.logo} src={LogoNav} alt="Logo de Navegación" />
        </Link>

        <ul className={styles.links}>
          <li>
            <a
              className={styles.link}
              href="#remeras"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('remeras');
              }}
            >
              Remeras
            </a>
          </li>
          <li>
            <a
              className={styles.link}
              href="#hoodies"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hoodies');
              }}
            >
              Buzos
            </a>
          </li>
          <li>
            <a
              className={styles.link}
              href="#accesorios"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('accesorios');
              }}
            >
              Accesorios
            </a>
          </li>
        </ul>

        {/* Íconos */}
        <ul className={styles.icons_menu}>
          <li className={`${styles.search_icon} disabled-link`}>
            <CgSearch />
          </li>
          <li className={styles.cart_icon} onClick={manejarAperturaModalCarrito}>
            <CartIcon />
          </li>
          <li className={styles.mobile_icon}>
            <RiMenuLine onClick={toggleSideNav} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
