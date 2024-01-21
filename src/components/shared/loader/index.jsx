import React from 'react';
import styles from './loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <img
        src='/assets/images/loader.png'
        alt='Loader'
        className={styles.rotate}
      />
    </div>
  );
};

export default Loader;
