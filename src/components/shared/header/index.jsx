/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import styles from './header.module.css';
import { Link } from 'react-router-dom';

function Header(props) {
  const { menuOpened, setMenuOpened } = props;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  const closeMenu = () => {
    setMenuOpened(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.titulo}>
        <img
          className={styles.logo}
          src='assets/logos/gym-logo.jpeg'
          alt='logo'
        />
        <h1 className={styles.arena}>Arena Sport Center</h1>
      </div>
      {}
      <div
        className={
          windowSize.width <= 720
            ? menuOpened
              ? `${styles.menu} ${styles.menuActive}`
              : `${styles.menu}`
            : `${styles.bigMenu}`
        }
      >
        <ul className={styles.ul}>
          <Link to={'/'}>
            <li
              className={styles.li}
              onClick={() => {
                closeMenu();
              }}
            >
              Home
            </li>
          </Link>
          <li
            className={styles.li}
            onClick={() => {
              window.open(
                'https://wa.me/+59893638947?text=Quiero%20más%20información',
                '_blank',
              );
              closeMenu();
            }}
          >
            Contacto
          </li>
          <Link to={'/login'}>
            {' '}
            <li
              className={styles.li}
              onClick={() => {
                closeMenu();
              }}
            >
              Ingresar
            </li>
          </Link>
        </ul>
      </div>
      <div
        className={
          windowSize.width > 700
            ? `${styles.noBurger}`
            : menuOpened
            ? `${styles.burgerMenu} ${styles.burgerMenuActive}`
            : `${styles.burgerMenu}`
        }
        onClick={() => {
          setMenuOpened(!menuOpened);
        }}
      >
        <div className={styles.burgerLine}></div>
        <div className={styles.burgerLine}></div>
        <div className={styles.burgerLine}></div>
      </div>
    </div>
  );
}

export default Header;
