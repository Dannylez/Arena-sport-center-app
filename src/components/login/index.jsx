import React from 'react';
import styles from './login.module.css';

function Login() {
  return (
    <div className={styles.container}>
      <h2>Ingresar</h2>
      <form className={styles.form}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input className={styles.formInput}></input>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Contraseña:</label>
          <input className={styles.formInput}></input>
        </div>
        <div className={styles.formBtns}>
          <button>Volver</button>
          <button>Aceptar</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
