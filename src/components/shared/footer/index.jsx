import styles from './footer.module.css';

function Footer() {
  return (
    <div className={styles.footer}>
      <div
        className={styles.address}
        onClick={() => {
          window.open('https://maps.app.goo.gl/zppDw1Bk8WsQ51zaA', '_blank');
        }}
      >
        <div className={styles.back}>
          <div className={`${styles.logo} ${styles.home}`}></div>
        </div>
        <p className={styles.pAddress}>Tomas Gomensoro 3109</p>
      </div>
      <div className={styles.logos}>
        <div
          className={styles.back}
          onClick={() => {
            window.open(
              'https://www.facebook.com/profile.php?id=61553887304999',
              '_blank',
            );
          }}
        >
          <div className={`${styles.logo} ${styles.fb}`}></div>
        </div>
        <div
          className={styles.back}
          onClick={() => {
            window.open(
              'https://www.instagram.com/arenasport.center?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
              '_blank',
            );
          }}
        >
          <div className={`${styles.logo} ${styles.ig}`}></div>
        </div>
        <div
          className={styles.back}
          onClick={() => {
            window.open('https://wa.me/+59893638947', '_blank');
          }}
        >
          <div className={`${styles.logo} ${styles.wp}`}></div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
