/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { useController, useForm } from 'react-hook-form';
import Joi from 'joi';
import Select from 'react-select';
import { joiResolver } from '@hookform/resolvers/joi';
import { addDays, format, parse, subYears } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../../../redux/class/classSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../../shared/modal';
import { fetchTrainerById } from '../../../../redux/trainer/trainerSlice';
import editTrainer from '../../../../utils/trainer/editTrainer';
import createTrainer from '../../../../utils/trainer/createTrainer';

function TrainerForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { trainer } = useSelector((state) => state.trainer);

  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [inputs, setInputs] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const maxBirthDay = format(subYears(new Date(), 3), 'yyyy-MM-dd');
  const minBirthDay = format(subYears(new Date(), 100), 'yyy-MM-dd');

  const createSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base': 'El nombre solo puede contener letras',
        'string.min': 'El nombre debe contener al menos 3 caracteres',
        'string.max': 'El nombre no puede tener mas de 15 caracteres',
        'string.empty': 'Campo obligatorio',
      }),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base': 'El apellido solo puede contener letras',
        'string.min': 'El apellido debe contener al menos 3 caracteres',
        'string.max': 'El apellido no puede tener mas de 25 caracteres',
        'string.empty': 'Campo obligatorio',
      }),
    ci: Joi.string()
      .required()
      .min(7)
      .max(8)
      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': 'Cédula de identidad sin puntos ni guiones',
        'string.min': 'Debe contener 7 u 8 números',
        'string.max': 'Debe contener 7 u 8 números',
        'string.empty': 'Campo obligatorio',
      }),
    phone: Joi.string()
      .required()
      .min(7)
      .max(15)
      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': 'Solo se aceptan números',
        'string.min': 'Debe contener al menos 7 números',
        'string.max': 'Número de teléfono demasiado largo',
        'string.empty': 'Campo obligatorio',
      }),
    email: Joi.string()
      .required()
      .pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
      .messages({
        'string.pattern.base': 'Formato de Email inválido',
        'string.empty': 'Campo obligatorio',
      }),
    password: Joi.string()
      .required()
      .messages({ 'string.empty': 'Campo obligatorio' }),
    birthDay: Joi.date().required().min(minBirthDay).max(maxBirthDay).messages({
      'string.empty': 'Campo obligatorio',
      'date.min': 'El alumno no puede tener mas de 100 años',
      'date.max': 'El alumno no puede tener menos de 3 años',
    }),
    medService: Joi.string().allow('').min(2).max(25).messages({
      'string.min': 'Debe contener al menos 2 caracteres',
      'string.max': 'Debe contener menos de 25 caracteres',
    }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    onChange,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(createSchema),
    defaultValues: inputs,
  });

  const formatDate = (date) => {
    const dateParsed = parse(date, 'dd/MM/yyyy', new Date());
    const dateFormated = format(dateParsed, 'yyyy-MM-dd');
    return dateFormated;
  };

  const onSubmit = async (data) => {
    data.birthDay = addDays(data.birthDay, 1);
    data.birthDay = format(data.birthDay, 'dd/MM/yyyy');
    try {
      let res;
      onEdit
        ? (res = await editTrainer(location.state?.id, data))
        : (res = await createTrainer(data));
      if (res.data) {
        navigate('/trainers', {
          state: { message: res.data.message },
        });
      } else {
        setMessageError(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors) => console.error(errors);

  useEffect(() => {
    if (location.state?.id) {
      setOnEdit(true);
      dispatch(fetchTrainerById(location.state.id));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(trainer).length !== 0 && location.state?.id) {
      const { _id, __v, fee, feeHistory, ...newImput } = trainer;
      setInputs(newImput);
    }
  }, [trainer]);

  useEffect(() => {
    if (Object.keys(inputs).length !== 0 && location.state?.id) {
      setValue('firstName', inputs.firstName || '');
      setValue('lastName', inputs.lastName || '');
      setValue('ci', inputs.ci || '');
      setValue('phone', inputs.phone || '');
      setValue('email', inputs.email || '');
      setValue('password', inputs.password || '');
      setValue('birthDay', formatDate(inputs.birthDay) || '');
      setValue('medService', inputs.medService || '');
    }
  }, [inputs]);

  useEffect(() => {
    if (messageError !== '') {
      setModalError(true);
      setTimeout(async () => {
        setModalError(false);
        setMessageError('');
      }, 3000);
    }
  });

  return (
    <div className={styles.container}>
      <Modal
        isOpen={modalError}
        popUp
        onClose={() => setModalError(false)}
        error
      >
        <p className={styles.errorMsg}>Error: {messageError}</p>
      </Modal>
      <h2 className={styles.titleForm}>
        {onEdit ? 'Editar profesor' : 'Agregar un profesor'}
      </h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Nombre:</label>
          <input
            className={styles.formInput}
            name={'firstName'}
            onChange={onChange}
            {...register('firstName')}
          ></input>
          <div
            className={
              errors.firstName?.message && touchedFields.firstName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.firstName?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Apellido:</label>
          <input
            className={styles.formInput}
            name={'lastName'}
            onChange={onChange}
            {...register('lastName')}
          ></input>
          <div
            className={
              errors.lastName?.message && touchedFields.lastName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.lastName?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>CI:</label>
          <input
            className={styles.formInput}
            name={'ci'}
            onChange={onChange}
            {...register('ci')}
          ></input>
          <div
            className={
              errors.ci?.message && touchedFields.ci
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.ci?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Teléfono:</label>
          <input
            className={styles.formInput}
            name={'phone'}
            onChange={onChange}
            {...register('phone')}
          ></input>
          <div
            className={
              errors.phone?.message && touchedFields.phone
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.phone?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input
            className={styles.formInput}
            name={'email'}
            onChange={onChange}
            {...register('email')}
          ></input>
          <div
            className={
              errors.email?.message && touchedFields.email
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.email?.message}</p>
          </div>
        </div>
        {!onEdit ? (
          <div className={styles.formField}>
            <label className={styles.formLabel}>Password:</label>
            <input
              type='password'
              className={styles.formInput}
              name={'password'}
              onChange={onChange}
              {...register('password')}
            ></input>
            <div
              className={
                errors.password?.message && touchedFields.password
                  ? `${styles.error}`
                  : `${styles.error}  ${styles.hidden} `
              }
            >
              <img src='/assets/logos/warning.svg' alt='Warning Logo' />
              <p className={styles.errorMsg}>{errors.password?.message}</p>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className={styles.formField}>
          <label className={styles.formLabel}>Fecha de nacimiento:</label>
          <input
            className={styles.formInput}
            name={'birthDay'}
            onChange={onChange}
            {...register('birthDay')}
            type='date'
          ></input>
          <div
            className={
              errors.birthDay?.message && touchedFields.birthDay
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.birthDay?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Servicio médico:</label>
          <input
            className={styles.formInput}
            name={'medService'}
            onChange={onChange}
            {...register('medService')}
          ></input>
          <div
            className={
              errors.medService?.message && touchedFields.medService
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.medService?.message}</p>
          </div>
        </div>
        <div className={styles.divBtns}>
          <Link to={'/trainers'} state={location.state}>
            <button className={`${styles.cancelBtn} ${styles.btn}`}>
              Cancelar
            </button>
          </Link>
          <button className={`${styles.addBtn} ${styles.btn}`} type='submit'>
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}

export default TrainerForm;
