import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRedoAlt } from 'react-icons/fa';

import { useCollection } from 'hooks/useCollection';

import FiltroProductos from './ProductFilter';
import { ProductCard, Loader } from 'components/common';

import styles from './index.module.scss';

// Slugs válidos para las colecciones
const slugsValidos = [
  'products',
  't-shirts',
  'hoodies-sweatshirts',
  'accessories',
];

const PaginaColeccion = () => {
  const navigate = useNavigate();
  const { id: slugId } = useParams();

  const { getCollection, isLoading, hasMore, error } = useCollection();

  const nuevoSlug = useRef(true);
  const [variantes, setVariantes] = useState(null);
  const [productosFiltrados, setProductosFiltrados] = useState(null);
  const [condicionesFiltro, setCondicionesFiltro] = useState({});
  const [ordenarPor, setOrdenarPor] = useState({
    field: 'createdAt',
    direction: 'asc',
    description: 'newest',
  });
  const [filtrando, setFiltrando] = useState(false);

  // 🌀 Efecto: cuando cambia el slug, obtener los productos de esa colección
  useEffect(() => {
    setVariantes(null);
    setProductosFiltrados(null);
    setCondicionesFiltro({});

    if (!nuevoSlug.current) {
      nuevoSlug.current = true;
      setOrdenarPor({
        field: 'createdAt',
        direction: 'asc',
        description: 'newest',
      });
    }

    // Si el slug no es válido, redirige al inicio
    if (!slugsValidos.includes(slugId)) {
      navigate('/');
    }

    const obtenerVariantes = async () => {
      const data = await getCollection({
        collectionName: slugId,
      });
      setVariantes(data);
    };

    obtenerVariantes();
  }, [slugId]);

  // 🧭 Efecto: al cambiar el tipo de ordenamiento
  useEffect(() => {
    if (nuevoSlug.current) {
      nuevoSlug.current = false;
      return;
    }

    window.scrollTo(0, 0);

    setProductosFiltrados(null);
    (async () => {
      const data = await getCollection({
        collectionName: slugId,
        sortBy: ordenarPor,
      });

      setVariantes(data);
    })();
  }, [ordenarPor]);

  // ♾️ Observador para carga infinita (scroll)
  const observador = useRef();
  const ultimaVarianteRef = useCallback(
    (nodo) => {
      if (isLoading || !hasMore) return;
      if (observador.current) observador.current.disconnect();

      observador.current = new IntersectionObserver(async (entradas) => {
        if (entradas[0].isIntersecting) {
          const masVariantes = await getCollection({
            collectionName: slugId,
            isNewQuery: false,
            sortBy: ordenarPor,
          });

          setVariantes((prev) => {
            if (!prev) return prev;
            return [...prev, ...masVariantes];
          });
        }
      });

      if (nodo) observador.current.observe(nodo);
    },
    [isLoading, hasMore]
  );

  // 🔍 Manejar filtrado
  const manejarFiltro = (productos) => {
    setTimeout(() => {
      setProductosFiltrados(productos);
      setFiltrando(false);
    }, 100);
  };

  // ⚙️ Actualizar condiciones del filtro
  const manejarActualizarCondicionesFiltro = (valor) => {
    setFiltrando(true);
    setProductosFiltrados([]);
    setCondicionesFiltro(valor);
  };

  // 🔽 Manejar tipo de orden
  const manejarOrden = (descripcion) => {
    if (descripcion === 'newest') {
      setOrdenarPor({
        field: 'createdAt',
        direction: 'asc',
        description,
      });
    } else if (descripcion === 'price: low-high') {
      setOrdenarPor({
        field: 'price',
        direction: 'asc',
        description,
      });
    } else if (descripcion === 'price: high-low') {
      setOrdenarPor({
        field: 'price',
        direction: 'desc',
        description,
      });
    }
  };

  return (
    <section className={styles.section}>
      {/* 🕓 Loader mientras se cargan los productos */}
      {(!variantes || !productosFiltrados) && (
        <Loader backdropClassName={styles.backdrop} />
      )}

      {variantes && (
        <>
          {productosFiltrados && (
            <div className="main-container">
              <div className={styles.container}>
                {/* 🚫 Si no se encontraron productos */}
                {productosFiltrados.length === 0 && !isLoading && !filtrando && (
                  <>
                    <p className={styles.less_filters_title}>
                      Lo sentimos, no se encontraron productos que coincidan con tu búsqueda 😞
                    </p>
                    <p className={styles.less_filters_subtitle}>
                      Usa menos filtros o
                    </p>
                    <div
                      onClick={() => manejarActualizarCondicionesFiltro({})}
                      className={styles.clear_all}
                    >
                      <span>Limpiar todo</span>
                      <FaRedoAlt />
                    </div>
                  </>
                )}

                {/* 🛍️ Lista de productos */}
                <div className={styles.grid_container}>
                  {productosFiltrados.map((variante, index) => (
                    <div
                      id={variante.id}
                      key={variante.id}
                      ref={
                        index + 1 === productosFiltrados.length
                          ? ultimaVarianteRef
                          : undefined
                      }
                      className={styles.product_card_container}
                    >
                      <ProductCard
                        productId={variante.productId}
                        variantId={variante.variantId}
                        model={variante.model}
                        color={variante.color}
                        discount={variante.discount}
                        currentPrice={variante.price}
                        actualPrice={variante.actualPrice}
                        type={variante.type}
                        slides={variante.slides}
                        images={variante.images}
                        numberOfVariants={variante.numberOfVariants}
                        skus={variante.skus}
                        isSoldOut={variante.isSoldOut}
                        allVariants={variante.allVariants}
                      />
                    </div>
                  ))}
                </div>

                {isLoading && (
                  <div className={styles.loading_more}>Cargando más productos...</div>
                )}
              </div>
            </div>
          )}

          {/* 🎛️ Filtros y ordenamiento */}
          <FiltroProductos
            allProducts={variantes}
            filterConditions={condicionesFiltro}
            sortByDescription={ordenarPor.description}
            handleFilter={manejarFiltro}
            handleSortBy={manejarOrden}
            handleUpdateFilterConditions={manejarActualizarCondicionesFiltro}
          />
        </>
      )}
    </section>
  );
};

export default PaginaColeccion;
