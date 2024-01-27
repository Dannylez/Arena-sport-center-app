/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import styles from './landing.module.css';
import { useLocation } from 'react-router-dom';
import Modal from '../shared/modal';

function Landing() {
  const location = useLocation();

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (location.state?.error) {
      setErrorMessage(location.state?.error);
      setErrorModal(true);
      setTimeout(async () => {
        setErrorModal(false);
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  return (
    <div className={styles.landing}>
      <Modal
        isOpen={errorModal}
        popUp
        onClose={() => setErrorModal(false)}
        error
      >
        {errorMessage}
      </Modal>
      <div className={styles.empiezaHoy}>
        <div className={styles.button}>
          <button
            className={styles.btn}
            onClick={() => {
              window.open(
                'https://wa.me/+59893638947?text=Quiero%20más%20información',
                '_blank',
              );
            }}
          >
            EMPIEZA HOY!
          </button>
        </div>
      </div>
      <div className={styles.containerCards}>
        <div className={styles.card}>
          <img
            className={styles.activityImg}
            src='assets/images/cross-funcional.jpg'
            alt='img'
          />
          <h3 className={styles.activityTitle}>CROSS FUNCIONAL</h3>
          <p className={styles.activityText}>
            Transforma tu cuerpo con el programa de entrenamiento más
            emocionante y efectivo. Fusionando levantamiento de pesas, cardio y
            gimnasia, desbloquearás tu máximo potencial físico.
          </p>
        </div>
        <div className={styles.card}>
          <img
            className={styles.activityImg}
            src='assets/images/karate.jpg'
            alt='img'
          />
          <h3 className={styles.activityTitle}>KARATE KYOKUSHIN</h3>
          <p className={styles.activityText}>
            Experimenta el poder y la disciplina del karate en nuestro gimnasio.
            Desarrolla fuerza, flexibilidad y concentración con nuestras clases
            que fusionan tradición y modernidad. ¡Únete para alcanzar tus metas
            en el arte marcial japonés por excelencia!
          </p>
        </div>
        <div className={styles.card}>
          <img
            className={styles.activityImg}
            src='assets/images/zumba.jpg'
            alt='img'
          />
          <h3 className={styles.activityTitle}>ZUMBA</h3>
          <p className={styles.activityText}>
            Sumérgete en la energía contagiosa de nuestras clases de Zumba.
            Fusionamos ritmos latinos y movimientos divertidos para crear un
            entrenamiento único que te hará bailar y quemar calorías.
          </p>
        </div>
        <div className={styles.card}>
          <img
            className={styles.activityImg}
            src='assets/images/gimnasia-terapeutica.jpg'
            alt='img'
          />
          <h3 className={styles.activityTitle}>GIMNASIA TERAPEUTICA</h3>
          <p className={styles.activityText}>
            Logra el equilibrio entre cuerpo y mente con nuestras clases de
            gimnasia terapéutica. Ejercicios suaves y enfoques terapéuticos para
            revitalizar tu bienestar. ¡Únete para sentirte mejor!
          </p>
        </div>
        <div className={styles.card}>
          <img
            className={styles.activityImg}
            src='assets/images/kick-boxing.jpg'
            alt='img'
          />
          <h3 className={styles.activityTitle}>KICK BOXING</h3>
          <p className={styles.activityText}>
            Potencia tu forma física con nuestras clases de kickboxing.
            Fusionamos artes marciales y cardio para una experiencia intensa y
            divertida. ¡Descubre la forma emocionante de mantenerte en forma y
            seguro!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
