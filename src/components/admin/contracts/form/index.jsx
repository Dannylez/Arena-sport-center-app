/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from 'react-hook-form';
import Modal from '../../../shared/modal';
import styles from './form.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchActivities } from '../../../../redux/activity/activitySlice';
import Joi from 'joi';
import createContract from '../../../../utils/contract/createContract';
import editContract from '../../../../utils/contract/editContract';

function ContractForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { activities } = useSelector((state) => state.activity);
  const { contracts } = useSelector((state) => state.contract);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputs, setInputs] = useState({});
  const [onEdit, setOnEdit] = useState(false);

  const createSchema = Joi.object({
    name: Joi.string().required().min(3).max(25).messages({
      'string.min': 'El nombre debe contener al menos 3 caracteres',
      'string.max': 'El nombre no puede tener mas de 25 caracteres',
      'string.empty': 'Campo obligatorio',
    }),
    activity: Joi.string()
      .required()
      .messages({ 'string.empty': 'Campo obligatorio' }),
    description: Joi.string().required().min(3).max(100).messages({
      'string.min': 'La descripción debe contener al menos 3 caracteres',
      'string.max': 'La descripción no puede tener mas de 100 caracteres',
      'string.empty': 'Campo obligatorio',
    }),
    price: Joi.number().required().messages({
      'number.base': 'El precio debe ser un numero',
      'string.empty': 'Campo obligatorio',
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
    defaultValues: { inputs },
  });

  useEffect(() => {
    dispatch(fetchActivities());
  }, []);

  useEffect(() => {
    console.log(location.state);
    if (location.state?.id) {
      setOnEdit(true);
      const cont = contracts.find((item) => item._id === location.state.id);
      setInputs(cont);
    }
  }, [contracts]);

  /*   useEffect(() => {
    if (inputs) {
      setValue('activity', inputs.activity?._id || '');
      setValue('day', inputs.day || '');
      setValue('startsAt', inputs.startsAt || '');
      setValue('endsAt', inputs.endsAt || '');
      setValue('room', inputs.room || '');
      setValue('trainer', inputs.trainer?._id || '');
    }
  }, [inputs]); */

  useEffect(() => {
    if (modalError) {
      setTimeout(async () => {
        setModalError(false);
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const onSubmit = async (data) => {
    try {
      let res;
      !onEdit
        ? (res = await createContract(data))
        : (res = await editContract(location.state?.id, data));
      if (res.data) {
        navigate('/contracts', {
          state: { message: res.data.message },
        });
      } else {
        setModalError(true);
        setErrorMessage(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titleForm}>Crear un contrato</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Nombre:</label>
          <input
            className={styles.formInput}
            name={'name'}
            onChange={onChange}
            {...register('name')}
          ></input>
          <div
            className={
              errors.firstName?.message && touchedFields.firstName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden}`
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.firstName?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Actividad:</label>
          <select
            className={styles.formInput}
            name={'activity'}
            onChange={onChange}
            {...register('activity')}
          >
            <option value='' hidden>
              Selecciona...
            </option>
            {activities.map((activity) => {
              return (
                <option key={activity?._id} value={activity?._id}>
                  {activity.name}
                </option>
              );
            })}
          </select>
          <div
            className={
              errors.firstName?.message
                ? `${styles.error}`
                : `${styles.error} ${styles.hidden}`
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.firstName?.message}</p>
          </div>
        </div>
        <div className={styles.formAreaField}>
          <label className={styles.formLabel}>Descripción:</label>
          <textarea
            className={styles.formArea}
            name={'description'}
            onChange={onChange}
            {...register('description')}
          ></textarea>
          <div
            className={
              errors.firstName?.message && touchedFields.firstName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden}`
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.firstName?.message}</p>
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Precio:</label>
          <input
            className={styles.formInput}
            name={'price'}
            onChange={onChange}
            {...register('price')}
          ></input>
          <div
            className={
              errors.firstName?.message && touchedFields.firstName
                ? `${styles.error}`
                : `${styles.error}  ${styles.hidden}`
            }
          >
            <img src='/assets/logos/warning.svg' alt='Warning Logo' />
            <p className={styles.errorMsg}>{errors.firstName?.message}</p>
          </div>
        </div>

        <div className={styles.divBtns}>
          <Link to={-1}>
            <button className={`${styles.cancelBtn} ${styles.btn}`}>
              Cancelar
            </button>
          </Link>
          <button className={`${styles.addBtn} ${styles.btn}`} type='submit'>
            Agregar
          </button>
        </div>
      </form>
      <Modal
        isOpen={modalError}
        popUp
        onClose={() => setModalError(false)}
        error
      >
        {errorMessage}
      </Modal>
    </div>
  );
}

export default ContractForm;
