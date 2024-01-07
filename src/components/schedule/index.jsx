/* eslint-disable react-hooks/exhaustive-deps */
import { addMinutes, isAfter, isBefore, parse } from 'date-fns';
import styles from './schedule.module.css';
import React, { useEffect, useState } from 'react';
import { fetchClasses, fetchClassById } from '../../redux/class/classSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMemberById } from '../../redux/member/memberSlice';
import Modal from '../shared/modal';
import unsubscribeMember from '../../utils/unsubscribeMember';
import { Link, useLocation } from 'react-router-dom';

function Schedule() {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [modalMembers, setModalMembers] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();

  const { classes, onlyClass, errorClass } = useSelector(
    (state) => state.class,
  );
  const { member, errorMember } = useSelector((state) => state.member);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const hours = [];
  for (let i = 8; i <= 21; i++) {
    hours.push(i.toString().padStart(2, '0') + ':00');
    hours.push(i.toString().padStart(2, '0') + ':15');
    hours.push(i.toString().padStart(2, '0') + ':30');
    hours.push(i.toString().padStart(2, '0') + ':45');
  }

  useEffect(() => {
    dispatch(fetchClasses());
    console.log(location.state);
  }, []);

  useEffect(() => {
    if (errorClass !== '' || errorMember !== '') {
      setModalError(true);
      setTimeout(function () {
        setModalError(false);
      }, 3000);
    }
  }, [errorClass, errorMember]);

  useEffect(() => {
    if (successMessage !== '') {
      setModalSuccess(true);
      setTimeout(async () => {
        setModalSuccess(false);
        setSuccessMessage('');
      }, 3000);
    }
  });

  const normH = (hour) => {
    return parse(hour, 'HH:mm', new Date());
  };

  const generateTd = ({ day, hour, classes }) => {
    const classToShow = classes?.find(
      (theClass) => theClass.day === day && theClass.startsAt === hour,
    );
    const isBetween = classes?.find(
      (theClass) =>
        theClass.day === day &&
        isAfter(normH(hour), normH(theClass.startsAt)) &&
        isBefore(normH(hour), normH(theClass.endsAt)),
    );
    if (classToShow) {
      classes?.find(
        (theClass) => theClass.day === day && theClass.startsAt === hour,
      );
      let i = 0;
      let newHour = normH(hour);
      while (isBefore(newHour, normH(classToShow.endsAt))) {
        i = i + 1;
        newHour = addMinutes(newHour, 15);
      }
      return (
        <td
          key={`${day}-${hour}`}
          className={`${styles.activeClass} ${styles.td}`}
          rowSpan={i}
          onClick={() => {
            dispatch(fetchClassById(classToShow._id));
            setOpenModal(true);
          }}
        >
          {classToShow.name}
        </td>
      );
    }
    if (isBetween) {
      return;
    }
    return (
      <td
        key={`${day}-${hour}`}
        className={`${
          hour.slice(-2) !== '00'
            ? `${styles.empty} ${styles.interHour}`
            : styles.empty
        } ${styles.td}`}
      ></td>
    );
  };

  const generateTable = ({ classes }) => {
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              {hour.slice(-2) === '00' ? (
                <td className={`${styles.hours} ${styles.td}`} rowSpan={4}>
                  {hour}
                </td>
              ) : (
                <React.Fragment />
              )}
              {days.map((day) => generateTd({ day, hour, classes }))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const closeModals = () => {
    setOpenModal(false);
    setModalMembers(false);
    setModalDelete(false);
  };

  return (
    <div>
      <Modal
        isOpen={openModal}
        onClose={() => {
          closeModals();
        }}
        previous={() => {
          closeModals();
        }}
      >
        <div className={styles.modalContent}>
          <div className={styles.title}>
            <h2 className={styles.nombreClase}>{onlyClass.name}</h2>
          </div>
          <p className={styles.pInfo}>
            {onlyClass.day} {onlyClass.startsAt}-{onlyClass.endsAt}
          </p>
          <p className={styles.pInfo}> En {onlyClass.room} </p>
          <p className={styles.pProfe}>
            {' '}
            Profesor: {onlyClass.trainer?.firstName}{' '}
            {onlyClass.trainer?.lastName}{' '}
          </p>
          <p className={styles.pAlumno}>
            {' '}
            Alumnos: {onlyClass.members?.length}{' '}
          </p>
          <button
            className={styles.alumnosBtn}
            onClick={() => {
              setOpenModal(false);
              setModalMembers(true);
            }}
          >
            {' '}
            Ver alumnos
          </button>{' '}
        </div>
      </Modal>
      <Modal
        isOpen={modalMembers}
        onClose={() => {
          closeModals();
        }}
        previous={() => {
          setModalMembers(false);
          setOpenModal(true);
        }}
      >
        <div className={styles.modalContent}>
          <div className={styles.title}>
            <h2 className={styles.nombreClase}>Lista de alumnos</h2>
          </div>
          <div className={styles.subTitle}>
            <span>
              <p className={styles.pInfo}>{onlyClass.name}</p>
              <p className={styles.pInfo}>
                {onlyClass.day} {onlyClass.startsAt}-{onlyClass.endsAt}
              </p>
              <p className={styles.pInfo}> En {onlyClass.room} </p>
            </span>
            <Link
              /* to={{
                pathname: '/members',
                state: { add: true },
              }} */ to={'/members'}
              state={{ add: true }}
            >
              <button className={styles.addBtn}>Agregar</button>
            </Link>
          </div>
          <div>
            {onlyClass.members?.map((member) => {
              return (
                <div key={member._id} className={styles.memberTr}>
                  <span className={styles.memberSpan}>
                    {member.firstName} {member.lastName}
                  </span>
                  <span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => {
                        dispatch(fetchMemberById(member._id));
                        setModalDelete(true);
                      }}
                    >
                      Borrar
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        previous={() => setModalDelete(false)}
      >
        <div className={styles.titleDelete}>
          <h2 className={styles.nombreClase}>Borrar alumno </h2>
        </div>
        <div>
          <p className={styles.textDelete}>
            {' '}
            Seguro que quieres desvincular a {member.firstName}{' '}
            {member.lastName} de la clase de {onlyClass.name}?
          </p>
        </div>
        <div>
          <button
            onClick={async () => {
              try {
                await unsubscribeMember(member, onlyClass);
                setSuccessMessage(
                  `Se ha desvinculado a ${member.firstName} ${member.lastName} de ${onlyClass.name} de los ${onlyClass.day}`,
                );
                dispatch(fetchClassById(onlyClass._id));
                setModalDelete(false);
              } catch (error) {
                console.error('Error: ', error);
              }
            }}
          >
            Aceptar
          </button>
          <button onClick={() => setModalDelete(false)}>Cancelar</button>
        </div>
      </Modal>
      <div className={styles.container}>
        <div className={styles.grilla}>{generateTable({ classes })}</div>
      </div>
      <Modal
        isOpen={modalError}
        popUp
        onClose={() => setModalError(false)}
        error
      >
        {errorClass ? <p>Error: {errorClass}</p> : ''}
        {errorMember ? <p>Error: {errorMember}</p> : ''}
      </Modal>
      <Modal
        isOpen={modalSuccess}
        popUp
        onClose={() => setModalSuccess(false)}
        success
      >
        {successMessage}
      </Modal>
    </div>
  );
}

export default Schedule;
