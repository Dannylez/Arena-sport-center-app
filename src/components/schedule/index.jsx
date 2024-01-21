/* eslint-disable react-hooks/exhaustive-deps */
import { addMinutes, isAfter, isBefore, parse } from 'date-fns';
import styles from './schedule.module.css';
import React, { useEffect, useState } from 'react';
import { fetchClasses, fetchClassById } from '../../redux/class/classSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMemberById } from '../../redux/member/memberSlice';
import Modal from '../shared/modal';
import unsubscribeMember from '../../utils/member/unsubscribeMember';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import deleteClass from '../../utils/class/deleteClass';
import Loader from '../shared/loader';

function Schedule() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalMembers, setModalMembers] = useState(false);
  const [modalDeleteMember, setModalDeleteMember] = useState(false);
  const [modalDeleteClass, setModalDeleteClass] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message);

  const [deleteMode, setDeleteMode] = useState(false);

  const { loadingAuth, role } = useSelector((state) => state.auth);
  const { loadingClass, classes, onlyClass, errorClass } = useSelector(
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
    if (role === 'ADMIN') {
      setIsAdmin(true);
    }
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
    dispatch(fetchClasses());
    if (!role && !loadingAuth && classes.length !== 0) {
      console.log(role, classes, loadingAuth);
      navigate('/', { state: { error: 'Sesión expirada' } });
    }
    if (role === 'ADMIN') {
      setIsAdmin(true);
    }
  }, [loadingAuth]);

  useEffect(() => {
    if (successMessage) {
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
          className={
            deleteMode
              ? `${styles.deleteClass} ${styles.activeClass} ${styles.td}`
              : `${styles.activeClass} ${styles.td}`
          }
          rowSpan={i}
          onClick={() => {
            if (deleteMode) {
              setModalDeleteClass(true);
            } else {
              setOpenModal(true);
            }
            dispatch(fetchClassById(classToShow._id));
          }}
        >
          {classToShow.activity?.name}
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
    setModalDeleteMember(false);
  };

  return (
    <div>
      <div className={styles.container}>
        {classes.length === 0 && loadingClass ? (
          <div className={styles.loader}>
            <Loader></Loader>
          </div>
        ) : (
          <>
            {' '}
            <div className={styles.grilla}>{generateTable({ classes })}</div>
            <div
              className={isAdmin ? `${styles.isAdmin}` : `${styles.notAdmin}`}
            >
              <Link to='/class/form'>
                <button className={styles.newClassBtn}> Crear Clase</button>
              </Link>
              <button
                className={styles.deleteClassBtn}
                onClick={() => {
                  setDeleteMode(!deleteMode);
                }}
              >
                {' '}
                Eliminar Clase
              </button>
            </div>{' '}
          </>
        )}
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
            <h2 className={styles.nombreClase}>{onlyClass.activity?.name}</h2>
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
          <div>
            <button
              className={styles.alumnosBtn}
              onClick={() => {
                setOpenModal(false);
                setModalMembers(true);
              }}
            >
              {' '}
              Ver alumnos
            </button>
            <Link to={'/class/form'} state={{ id: onlyClass._id }}>
              <button>Editar clase</button>
            </Link>
          </div>
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
              <p className={styles.pInfo}>{onlyClass.activity?.name}</p>
              <p className={styles.pInfo}>
                {onlyClass.day} {onlyClass.startsAt}-{onlyClass.endsAt}
              </p>
              <p className={styles.pInfo}> En {onlyClass.room} </p>
            </span>
            <Link to={'/members'} state={{ class: onlyClass }}>
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
                        setModalDeleteMember(true);
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
        isOpen={modalDeleteMember}
        onClose={() => setModalDeleteMember(false)}
        previous={() => setModalDeleteMember(false)}
      >
        <div className={styles.titleDelete}>
          <h2 className={styles.nombreClase}>Borrar alumno </h2>
        </div>
        <div>
          <p className={styles.textDelete}>
            {' '}
            Seguro que quieres desvincular a {member.firstName}{' '}
            {member.lastName} de la clase de {onlyClass.activity?.name}?
          </p>
        </div>
        <div>
          <button
            onClick={async () => {
              try {
                await unsubscribeMember(member, onlyClass);
                setSuccessMessage(
                  `Se ha desvinculado a ${member.firstName} ${member.lastName} de ${onlyClass.activity?.name} de los ${onlyClass.day}`,
                );
                dispatch(fetchClassById(onlyClass._id));
                setModalDeleteMember(false);
              } catch (error) {
                console.error('Error: ', error);
              }
            }}
          >
            Aceptar
          </button>
          <button onClick={() => setModalDeleteMember(false)}>Cancelar</button>
        </div>
      </Modal>
      <Modal
        isOpen={modalDeleteClass}
        onClose={() => setModalDeleteClass(false)}
        previous={() => setModalDeleteClass(false)}
      >
        <div className={styles.titleDelete}>
          <h2 className={styles.nombreClase}>Borrar Clase </h2>
        </div>
        <div>
          <p className={styles.textDelete}>
            {' '}
            Seguro que quieres eliminar la clase de {
              onlyClass.activity?.name
            }{' '}
            de los {onlyClass.day} a las {onlyClass.startsAt}?
          </p>
        </div>
        <div>
          <button
            onClick={async () => {
              try {
                await deleteClass(onlyClass._id);
                setSuccessMessage(
                  `Se ha eliminado la clase de ${onlyClass.activity?.name} de los
                  ${onlyClass.day} a las ${onlyClass.startsAt}`,
                );
                dispatch(fetchClasses());
                setModalDeleteClass(false);
              } catch (error) {
                console.error('Error: ', error);
              }
            }}
          >
            Aceptar
          </button>
          <button onClick={() => setModalDeleteMember(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
}

export default Schedule;
