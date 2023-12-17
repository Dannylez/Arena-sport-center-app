import styles from './header.module.css';

function Header() {
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
      <div className={styles.menu}>
        <ul>
          <li>Home</li>
          <li
            onClick={() => {
              window.open(
                'https://wa.me/+59893804706?text=Quiero%20más%20información',
                '_blank',
              );
            }}
          >
            Contacto
          </li>
          <li>Ingresar</li>
        </ul>
      </div>
      <button className={styles.burger}></button>
    </div>
  );
}

export default Header;
