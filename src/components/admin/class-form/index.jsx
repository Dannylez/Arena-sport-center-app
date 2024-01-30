/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from 'react-hook-form';
import Modal from '../../shared/modal';
import styles from './form.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchActivities } from '../../../redux/activity/activitySlice';
import { fetchTrainers } from '../../../redux/trainer/trainerSlice';
import createClass from '../../../utils/class/createClass';
import editClass from '../../../utils/class/editClass';

function ClassForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { activities } = useSelector((state) => state.activity);
  const { classes } = useSelector((state) => state.class);
  const { trainers } = useSelector((state) => state.trainer);
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputs, setInputs] = useState({});
  const [onEdit, setOnEdit] = useState(false);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const hours = [];
  for (let i = 8; i <= 21; i++) {
    hours.push(i.toString().padStart(2, '0') + ':00');
    hours.push(i.toString().padStart(2, '0') + ':15');
    hours.push(i.toString().padStart(2, '0') + ':30');
    hours.push(i.toString().padStart(2, '0') + ':45');
  }

  const rooms = ['Salón chico', 'Salón grande', 'Ambos salones'];

  const {
    register,
    handleSubmit,
    setValue,
    onChange,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: { inputs },
  });

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchTrainers());

    if (location.state?.id) {
      setOnEdit(true);
      const classy = classes.find((item) => item._id === location.state.id);
      const { _id, __v, members, ...newImput } = classy;
      setInputs(newImput);
    }
  }, []);

  useEffect(() => {
    setValue('activity', inputs.activity?._id || '');
    setValue('day', inputs.day || '');
    setValue('startsAt', inputs.startsAt || '');
    setValue('endsAt', inputs.endsAt || '');
    setValue('room', inputs.room || '');
    setValue('trainer', inputs.trainer?._id || '');
  }, [inputs]);

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
        ? (res = await createClass(data))
        : (res = await editClass(location.state?.id, data));
      if (res.data) {
        navigate('/schedule', {
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
      <h2 className={styles.titleForm}>Crear una clase</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
                : `${styles.error}  ${styles.hidden} `
            }
          ></div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Dia:</label>
          <select
            className={styles.formInput}
            name={'day'}
            onChange={onChange}
            {...register('day')}
          >
            <option value='' hidden>
              Selecciona...
            </option>
            {days.map((day) => {
              return (
                <option key={day} value={day}>
                  {day}
                </option>
              );
            })}
          </select>
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
          <label className={styles.formLabel}>Empieza:</label>
          <select
            className={styles.formInput}
            name={'startsAt'}
            onChange={onChange}
            {...register('startsAt')}
          >
            <option value='' hidden>
              Selecciona...
            </option>
            {hours.map((hour) => {
              return (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
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
          <label className={styles.formLabel}>Hasta:</label>
          <select
            className={styles.formInput}
            name={'endsAt'}
            onChange={onChange}
            {...register('endsAt')}
          >
            <option value='' hidden>
              Selecciona...
            </option>
            {hours.map((hour) => {
              return (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
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
          <label className={styles.formLabel}>Sala:</label>
          <select
            className={styles.formInput}
            name={'room'}
            onChange={onChange}
            {...register('room')}
          >
            <option value='' hidden>
              Selecciona...
            </option>
            {rooms.map((room) => {
              return (
                <option key={room} value={room}>
                  {room}
                </option>
              );
            })}
          </select>
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
          <label className={styles.formLabel}>Profesor:</label>
          <select
            className={styles.formInput}
            name={'trainer'}
            onChange={onChange}
            {...register('trainer')}
            type='date'
          >
            <option value='' hidden>
              Selecciona...
            </option>
            {trainers.map((trainer) => {
              return (
                <option key={trainer._id} value={trainer._id}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              );
            })}
          </select>
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

export default ClassForm;
