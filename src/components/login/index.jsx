import React, { useState } from 'react';
import styles from './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { login } from '../../utils/auth';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../../redux/auth/authSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loginSchema = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
  });
  const {
    register,
    handleSubmit,
    /* formState: { errors }, */
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoginError(false);
      data.email = data.email.toLowerCase();
      const res = await login(data);
      const token = localStorage.getItem('token');
      dispatch(verifyUser(token));
      if (res === 'Sesión iniciada') {
        return navigate('/schedule');
      }
      setErrorMessage('Email o contraseña incorrectos');
      return setLoginError(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Ingresar</h2>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input
            className={styles.formInput}
            name={'email'}
            {...register('email')}
          ></input>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Contraseña:</label>
          <input
            className={styles.formInput}
            name={'password'}
            {...register('password')}
          ></input>
        </div>
        <div
          className={
            loginError
              ? `${styles.error}`
              : `${styles.error}  ${styles.hidden} `
          }
        >
          <img src='/assets/logos/warning.svg' alt='Warning Logo' />
          <p className={styles.errorMsg}>{errorMessage}</p>
        </div>
        <div className={styles.formBtns}>
          <button default type='submit' className={styles.addBtn}>
            Aceptar
          </button>
          <Link to={'/'}>
            {' '}
            <button
              className={styles.cancelBtn}
              onClick={() => console.log('hola')}
            >
              Volver
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
