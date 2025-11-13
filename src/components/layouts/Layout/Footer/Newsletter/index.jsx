import { useRef, useEffect } from 'react';

import { useNewsletter } from 'hooks/useNewsletter';
import { useToast } from 'hooks/useToast';

import { Button } from 'components/common';

import styles from './index.module.scss';

const Newsletter = () => {
  const { subscribeToNewsletter, success, error } = useNewsletter();
  const { sendToast } = useToast();

  const emailInputRef = useRef();
  const scrollToRef = useRef();

  const scrollTo = () => {
    scrollToRef.current.scrollIntoView();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailInputRef.current.value;

    await subscribeToNewsletter({ email });
  };

  useEffect(() => {
    if (success || error) {
      scrollTo();
    }

    if (error) {
      sendToast({ error: true, content: { message: error.message } });
    }
  }, [success, error]);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <h3 className={styles.title}>Suscríbete al boletín de FLAAKKO</h3>
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            ref={scrollToRef}
          >
            {!success && (
              <>
                <input
                  className={styles.input}
                  placeholder="Tu correo electrónico"
                  type="email"
                  ref={emailInputRef}
                  required
                />
                <Button type="submit" className={styles.button}>
                  Suscribirse
                </Button>
              </>
            )}
            {success && (
              <Button type="button" className={styles.success} disabled>
                {success.message}
              </Button>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default Newsletter;
