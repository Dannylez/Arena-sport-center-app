import React from 'react';
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
      const res = await login(data);
      dispatch(verifyUser);
      if (res === 'Sesión iniciada') {
        navigate('/schedule');
      }
    } catch (error) {
      console.log(error);
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
        <div className={styles.formBtns}>
          <Link to={'/'}>
            {' '}
            <button>Volver</button>
          </Link>
          <button type='submit'>Aceptar</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
