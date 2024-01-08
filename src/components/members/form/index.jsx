/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { useController, useForm } from 'react-hook-form';
import Joi from 'joi';
import Select from 'react-select';
import { joiResolver } from '@hookform/resolvers/joi';
import { addYears, format, subYears } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../../redux/class/classSlice';
import { fetchContracts } from '../../../redux/contract/contractSlice';
import createMember from '../../../utils/createMember';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../shared/modal';

function MemberForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { classes } = useSelector((state) => state.class);
  const { contracts } = useSelector((state) => state.contract);
  const [contractsOptions, setContractsOptions] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [messageError, setMessageError] = useState('');

  const maxBirthDay = format(subYears(new Date(), 3), 'yyyy-MM-dd');
  const minBirthDay = format(subYears(new Date(), 100), 'yyy-MM-dd');
  const maxVigencyDate = format(addYears(new Date(), 10), 'yyy-MM-dd');
  const minVigencyDate = format(new Date(), 'yyy-MM-dd');
  const createSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base': 'El nombre solo puede contener letras',
        'string.min.base': 'El nombre debe contener al menos 3 caracteres',
        'string.max.base': 'El nombre no puede tener mas de 15 caracteres',
        'string.required.base': 'Campo obligatorio',
      }),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(25)
      .pattern(/^[a-zA-Z-]+$/)
      .messages({
        'string.pattern.base': 'El apellido solo puede contener letras',
        'string.min.base': 'El apellido debe contener al menos 3 caracteres',
        'string.max.base': 'El apellido no puede tener mas de 25 caracteres',
        'string.required.base': 'Campo obligatorio',
      }),
    ci: Joi.string()
      .required()
      .min(7)
      .max(8)
      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': 'Cédula de identidad sin puntos ni guiones',
        'string.min.base': 'Debe contener 7 u 8 números',
        'string.max.base': 'Debe contener 7 u 8 números',
        'string.required.base': 'Campo obligatorio',
      }),
    phone: Joi.string()
      .min(7)
      .max(15)
      .pattern(/^[0-9]+$/)
      .messages({
        'string.pattern.base': 'Solo se aceptan números',
        'string.min.base': 'Debe contener al menos 7 números',
        'string.max.base': 'Número de teléfono demasiado largo',
      }),
    email: Joi.string()
      .pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
      .messages({ 'string.pattern.base': 'Formato de Email inválido' }),
    birthDay: Joi.date().required().min(minBirthDay).max(maxBirthDay).messages({
      'date.required': 'Campo obligatorio',
      'date.min': 'El alumno no puede tener mas de 100 años',
      'date.max': 'El alumno no puede tener menos de 3 años',
    }),
    medService: Joi.string().min(2).max(25).messages({
      'string.min.base': 'Debe contener al menos 2 caracteres',
      'string.max.base': 'Debe contener menos de 25 caracteres',
    }),
    healthCardUpToDate: Joi.boolean(),
    healthCardVigency: Joi.date().min(minVigencyDate).max(maxVigencyDate),
    classes: Joi.array().items(Joi.string()),
    contracts: Joi.array().items(Joi.string()),
  });

  const {
    register,
    handleSubmit,
    watch,
    onChange,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(createSchema),
  });

  const watchAllFields = watch();

  const {
    field: { value: clase, onChange: onClassChange },
  } = useController({ name: 'classes', control });

  const {
    field: { value: contract, onChange: onContractChange },
  } = useController({ name: 'contracts', control });

  const onSubmit = async (data) => {
    data.birthDay = format(data.birthDay, 'dd/MM/yyyy');
    data.healthCardVigency = format(data.healthCardVigency, 'dd/MM/yyyy');
    try {
      const res = await createMember(data);
      if (res.data) {
        navigate('/members', {
          state: { message: res.data.message, class: location.state.class },
        });
      } else {
        setMessageError(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const classesOptions = classes.map((clase) => ({
    value: clase._id,
    label: `${clase.activity?.name} (${clase.day.substring(0, 3)} ${
      clase.startsAt
    })`,
  }));

  useEffect(() => {
    const activitiesSet = new Set();
    classes.forEach((clase) => {
      if (watchAllFields.classes?.includes(clase._id)) {
        activitiesSet.add(clase.activity?.name);
      }
    });
    const activities = Array.from(activitiesSet);
    const newContracts = [];
    contracts.forEach((cont) => {
      if (activities.includes(cont.activity?.name)) {
        newContracts.push(cont);
      }
    });
    const setContracts = newContracts.map((cont) => ({
      value: cont._id,
      label: cont.name,
    }));
    setContractsOptions(setContracts);
  }, [watchAllFields.classes]);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchContracts());
  }, []);

  /*   useEffect(() => {
    console.log(errors);
  }, [errors]);
 */
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
      <img src='assets/warning.svg' alt='warning'></img>
      <Modal
        isOpen={modalError}
        popUp
        onClose={() => setModalError(false)}
        error
      >
        <p>Error: {messageError}</p>
      </Modal>
      <h2 className={styles.titleForm}>Agregar un alumno</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
              errors.firstName?.message
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden} `
            }
          >
            <img src='' alt='Warning Logo' />
            <p>{errors.firstName?.message}</p>
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
          <p
            className={
              errors.lastName?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.lastName?.message}
          </p>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>CI:</label>
          <input
            className={styles.formInput}
            name={'ci'}
            onChange={onChange}
            {...register('ci')}
          ></input>
          <p
            className={
              errors.ci?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.ci?.message}
          </p>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Teléfono:</label>
          <input
            className={styles.formInput}
            name={'phone'}
            onChange={onChange}
            {...register('phone')}
          ></input>
          <p
            className={
              errors.phone?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.phone?.message}
          </p>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email:</label>
          <input
            className={styles.formInput}
            name={'email'}
            onChange={onChange}
            {...register('email')}
          ></input>
          <p
            className={
              errors.email?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.email?.message}
          </p>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Fecha de nacimiento:</label>
          <input
            className={styles.formInput}
            name={'birthDay'}
            onChange={onChange}
            {...register('birthDay')}
            type='date'
          ></input>
          <p
            className={
              errors.birthDay?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.birthDay?.message}
          </p>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Servicio médico:</label>
          <input
            className={styles.formInput}
            name={'medService'}
            onChange={onChange}
            {...register('medService')}
          ></input>
          <p
            className={
              errors.medService?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.medService?.message}
          </p>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Carnet de salud:</label>
          <input
            name={'healthCardUpToDate'}
            onChange={onChange}
            {...register('healthCardUpToDate')}
            type='checkbox'
          ></input>
          <input
            className={styles.formInput}
            name={'healthCardVigency'}
            onChange={onChange}
            {...register('healthCardVigency')}
            type='date'
          ></input>
          <p
            className={
              errors.healthCardVigency?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            {errors.healthCardVigency?.message}
          </p>
        </div>
        <div className={`${styles.formField} ${styles.selectField}`}>
          <label className={styles.formLabel}>Clases:</label>
          <Select
            onChange={(e) => {
              onClassChange(e.map((clase) => clase.value));
            }}
            className={`${styles.formInput} ${styles.formSelect}`}
            defaultValue={[]}
            value={
              clase
                ? classesOptions.find(
                    (singleClass) => singleClass._id === clase,
                  )
                : clase
            }
            options={classesOptions}
            isMulti
          />
        </div>
        {watchAllFields.classes && watchAllFields.classes?.length !== 0 ? (
          <div className={`${styles.formField} ${styles.selectField}`}>
            <label className={styles.formLabel}>Contratos:</label>
            <Select
              onChange={(e) => {
                onContractChange(e.map((cont) => cont.value));
              }}
              className={`${styles.formInput} ${styles.formSelect}`}
              value={
                contract
                  ? contractsOptions.find(
                      (singleClass) => singleClass._id === contract,
                    )
                  : contract
              }
              defaultValue={[]}
              options={contractsOptions}
              isMulti
            />
          </div>
        ) : (
          ''
        )}
        <div className={styles.divBtns}>
          <Link to={'/members'} state={location.state}>
            <button className={`${styles.cancelBtn} ${styles.btn}`}>
              Cancelar
            </button>
          </Link>
          <button className={`${styles.addBtn} ${styles.btn}`} type='submit'>
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
