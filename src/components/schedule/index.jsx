import { addMinutes, isAfter, isBefore, parse } from 'date-fns';
import styles from './schedule.module.css';
import React, { useEffect, useState } from 'react';

function Schedule() {
  const [openModal, setOpenModal] = useState(false);
  const [modalMembers, setModalMembers] = useState(false);
  const [classInfo, setClassInfo] = useState({});
  const [membersInfo, setMembersInfo] = useState([]);
  const [classes, setClasses] = useState([]);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const hours = [];
  for (let i = 8; i <= 21; i++) {
    hours.push(i.toString().padStart(2, '0') + ':00');
    hours.push(i.toString().padStart(2, '0') + ':15');
    hours.push(i.toString().padStart(2, '0') + ':30');
    hours.push(i.toString().padStart(2, '0') + ':45');
  }

  const getClasses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/class`, {
        method: 'GET',
      });
      if (res.status === 200) {
        const { data } = await res.json();
        return data;
      } else {
        throw new Error('ERROR');
      }
    } catch (error) {
      return console.log(error);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await getClasses();
        setClasses(classesData);
        console.log(classes);
      } catch (error) {
        console.error('Error al obtener las clases', error);
      }
    };
    fetchClasses();
  }, []);

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
          className={styles.activeClass}
          rowSpan={i}
          onClick={() => {
            setOpenModal(true);
            setClassInfo(classToShow);
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
        className={
          hour.slice(-2) !== '00'
            ? `${styles.empty} ${styles.interHour}`
            : styles.empty
        }
      ></td>
    );
  };

  const generateTable = ({ classes }) => {
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              {hour.slice(-2) === '00' ? (
                <td className={styles.hours} rowSpan={4}>
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

  return (
    <div>
      <div
        className={
          openModal || modalMembers
            ? `${styles.modalOpen}`
            : `${styles.modalClosed}`
        }
        onClick={() => {
          setOpenModal(false);
          setModalMembers(false);
        }}
      >
        {openModal ? (
          <div
            className={styles.modal}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {' '}
            <div className={styles.title}>
              <h2 className={styles.nombreClase}>{classInfo.name}</h2>
              <span
                className={styles.closeBtn}
                onClick={() => {
                  setOpenModal(false);
                  setModalMembers(false);
                  setClassInfo({});
                }}
              >
                &times;
              </span>
            </div>
            <p className={styles.pInfo}>
              {classInfo.day} {classInfo.startsAt}-{classInfo.endsAt}
            </p>
            <p className={styles.pInfo}> En {classInfo.room} </p>
            <p className={styles.pProfe}>
              {' '}
              Profesor: {classInfo.trainer?.firstName}{' '}
              {classInfo.trainer?.lastName}{' '}
            </p>
            <p className={styles.pAlumno}>
              {' '}
              Alumnos: {classInfo.members?.length}{' '}
            </p>
            <button
              className={styles.alumnosBtn}
              onClick={() => {
                setOpenModal(false);
                setMembersInfo(classInfo.members);
                setModalMembers(true);
              }}
            >
              {' '}
              Ver alumnos
            </button>{' '}
          </div>
        ) : (
          ''
        )}
        ;
        {modalMembers ? (
          <div
            className={styles.modal}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={styles.title}>
              <h2 className={styles.nombreClase}>Lista de alumnos</h2>
              <span
                className={styles.closeBtn}
                onClick={() => {
                  setModalMembers(false);
                  setOpenModal(true);
                  setMembersInfo([{}]);
                }}
              >
                &times;
              </span>
            </div>
            <div className={styles.subTitle}>
              <span>
                <p className={styles.pInfo}>{classInfo.name}</p>
                <p className={styles.pInfo}>
                  {classInfo.day} {classInfo.startsAt}-{classInfo.endsAt}
                </p>
                <p className={styles.pInfo}> En {classInfo.room} </p>
              </span>
              <button className={styles.addBtn}>Agregar</button>
            </div>
            <div>
              {membersInfo.map((member) => {
                return (
                  <div key={member._id} className={styles.memberTr}>
                    <span className={styles.memberSpan}>
                      {member.firstName} {member.lastName}
                    </span>
                    <span>
                      <button className={styles.removeBtn}>Borrar</button>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className={styles.grilla}>{generateTable({ classes: classes })}</div>
    </div>
  );
}

export default Schedule;
