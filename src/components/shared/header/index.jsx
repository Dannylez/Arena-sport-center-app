/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import styles from './header.module.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../utils/auth';
import { verifyUser } from '../../../redux/auth/authSlice';

function Header(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menuOpened, setMenuOpened } = props;
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { role } = useSelector((state) => state.auth);

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
          src='/assets/logos/gym-logo.png'
          alt='logo'
          onClick={() => navigate('/')}
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
        {role === 'ADMIN' ? (
          <ul className={styles.ul}>
            {' '}
            <NavLink
              className={styles.li}
              to={'/'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                Home
              </li>
            </NavLink>
            <NavLink
              className={styles.li}
              to={'/schedule'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                {' '}
                Clases{' '}
              </li>
            </NavLink>
            <NavLink
              className={styles.li}
              to={'/members'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                {' '}
                Alumnos{' '}
              </li>
            </NavLink>
            <NavLink
              className={styles.li}
              to={'/trainers'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                {' '}
                Profesores{' '}
              </li>
            </NavLink>
            <NavLink
              className={styles.li}
              to={'/contracts'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                {' '}
                Contratos{' '}
              </li>
            </NavLink>
            <li
              className={styles.li}
              onClick={() => {
                logout();
                closeMenu();
                dispatch(verifyUser());
                navigate('/');
              }}
            >
              {' '}
              Cerrar sesión{' '}
            </li>
          </ul>
        ) : (
          ''
        )}
        {role === 'TRAINER' ? (
          <ul className={styles.ul}>
            {' '}
            <NavLink
              className={styles.li}
              to={'/'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                Home
              </li>
            </NavLink>
            <NavLink
              className={styles.li}
              to={'/schedule'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                {' '}
                Clases{' '}
              </li>
            </NavLink>
            <NavLink
              className={styles.li}
              to={'/members'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                {' '}
                Alumnos{' '}
              </li>
            </NavLink>
            <Link to={'/'} className={styles.li}>
              <li
                onClick={() => {
                  logout();
                  closeMenu();
                  dispatch(verifyUser());
                }}
              >
                {' '}
                Cerrar sesión{' '}
              </li>
            </Link>
          </ul>
        ) : (
          ''
        )}
        {!role ? (
          <ul className={styles.ul}>
            <NavLink
              className={styles.li}
              to={'/'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
            >
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                Home
              </li>
            </NavLink>
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
            <NavLink
              className={styles.li}
              to={'/login'}
              style={({ isActive }) => {
                return isActive ? { color: 'red' } : {};
              }}
              g
            >
              {' '}
              <li
                onClick={() => {
                  closeMenu();
                }}
              >
                Ingresar
              </li>
            </NavLink>
          </ul>
        ) : (
          ''
        )}
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
