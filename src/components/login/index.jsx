import React from 'react';
import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import axios from 'axios';

function Login() {

/* const loginSchema = Joi.object({
    email: Joi.string(),
    password: Joi.string()
})
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        mode: 'onChange',
        resolver: joiResolver(loginSchema),
      });

const onSubmit = async (data) => {
    console.log(data);
    try{ 
        const trainers = await axios
        .get(`${process.env.REACT_APP_API_URL}/api/trainer`);
        const user = trainers.data.find((trainer) => trainer.email === data.email)
        if(user) {const isPasswordMatch = await user.comparePassword(data.password)}
        console.log(isPasswordMatch)
    }


 catch(error) {console.log(error)}
 */
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Ingresar</h2>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input className={styles.formInput} name={'email'}
            {...register('email')}></input>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Contraseña:</label>
          <input className={styles.formInput} name={'password'}
            {...register('password')}></input>
        </div>
        <div className={styles.formBtns}>
          <Link to={'/'}>
            {' '}
            <button>Volver</button>
          </Link>
          <Link to={'/schedule'}>
            <button type='submit' onClick={()}>Trainer</button>
          </Link>
          <Link>Admin</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
