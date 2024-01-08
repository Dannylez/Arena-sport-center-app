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

  const { /* classes, */ onlyClass, errorClass } = useSelector(
    (state) => state.class,
  );
  const { member, errorMember } = useSelector((state) => state.member);

  const classes = [
    {
      _id: '657befad2c4dc62b74e3edd7',
      name: 'Cross Funcional',
      day: 'Martes',
      startsAt: '08:00',
      endsAt: '09:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [
        {
          _id: '656a5b4094545e9b5ce5d418',
          firstName: 'Prueba',
          lastName: 'Funciona',
          ci: '1244567',
          phone: '1234567',
          email: 'VAMOOOO@hotmail.com',
          birthDay: '14/08/23',
          medService: 'medica',
          healthCardUpToDate: true,
          healthCardVigency: '14/10/28',
          classes: ['657befad2c4dc62b74e3edd7'],
          contracts: ['656a5b0094545e9b5ce5d412'],
          __v: 0,
        },
        {
          _id: '65886242d7ebe3e912c6e0df',
          firstName: 'Mathias',
          lastName: 'Arenas',
          ci: '1244567',
          phone: '',
          email: '',
          birthDay: '02/04/1945',
          medService: 'SMI',
          healthCardUpToDate: true,
          healthCardVigency: '14/10/28',
          classes: ['657befad2c4dc62b74e3edd7'],
          contracts: [],
          __v: 0,
        },
        {
          _id: '657c9a152c4dc62b74e3ee22',
          firstName: 'Daniel',
          lastName: 'Lezama',
          ci: '1232567',
          phone: '1232567',
          email: 'VAMOasd@hotmail.com',
          birthDay: '14/08/23',
          medService: 'medica',
          healthCardUpToDate: true,
          healthCardVigency: '14/10/28',
          classes: ['657befad2c4dc62b74e3edd7', '657befad2c4dc62b74e3edd7'],
          contracts: ['656a5b0094545e9b5ce5d412'],
          __v: 0,
        },
      ],
      __v: 0,
    },
    {
      _id: '657befb42c4dc62b74e3edda',
      name: 'Cross Funcional',
      day: 'Miércoles',
      startsAt: '08:00',
      endsAt: '09:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657befba2c4dc62b74e3eddd',
      name: 'Cross Funcional',
      day: 'Jueves',
      startsAt: '08:00',
      endsAt: '09:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657befc02c4dc62b74e3ede0',
      name: 'Cross Funcional',
      day: 'Viernes',
      startsAt: '08:00',
      endsAt: '09:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657befe02c4dc62b74e3ede3',
      name: 'Gimnasia Terapéutica',
      day: 'Martes',
      startsAt: '10:30',
      endsAt: '11:30',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657befe92c4dc62b74e3ede6',
      name: 'Gimnasia Terapéutica',
      day: 'Jueves',
      startsAt: '10:30',
      endsAt: '11:30',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0092c4dc62b74e3ede9',
      name: 'Karate',
      day: 'Lunes',
      startsAt: '18:15',
      endsAt: '19:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf00e2c4dc62b74e3edec',
      name: 'Karate',
      day: 'Martes',
      startsAt: '18:15',
      endsAt: '19:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0142c4dc62b74e3edef',
      name: 'Karate',
      day: 'Jueves',
      startsAt: '18:15',
      endsAt: '19:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0192c4dc62b74e3edf2',
      name: 'Karate',
      day: 'Viernes',
      startsAt: '18:15',
      endsAt: '19:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0322c4dc62b74e3edf5',
      name: 'Zumba',
      day: 'Viernes',
      startsAt: '19:15',
      endsAt: '20:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0362c4dc62b74e3edf8',
      name: 'Zumba',
      day: 'Lunes',
      startsAt: '19:15',
      endsAt: '20:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf03e2c4dc62b74e3edfb',
      name: 'Zumba',
      day: 'Miércoles',
      startsAt: '19:15',
      endsAt: '20:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0552c4dc62b74e3edfe',
      name: 'Karate',
      day: 'Martes',
      startsAt: '19:15',
      endsAt: '20:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf05b2c4dc62b74e3ee01',
      name: 'Karate',
      day: 'Jueves',
      startsAt: '19:15',
      endsAt: '20:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0612c4dc62b74e3ee04',
      name: 'Karate',
      day: 'Jueves',
      startsAt: '20:15',
      endsAt: '21:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0662c4dc62b74e3ee07',
      name: 'Karate',
      day: 'Martes',
      startsAt: '20:15',
      endsAt: '21:15',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0852c4dc62b74e3ee0a',
      name: 'Cross Funcional',
      day: 'Lunes',
      startsAt: '20:00',
      endsAt: '21:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf08f2c4dc62b74e3ee0d',
      name: 'Cross Funcional',
      day: 'Miércoles',
      startsAt: '20:00',
      endsAt: '21:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0932c4dc62b74e3ee10',
      name: 'Cross Funcional',
      day: 'Viernes',
      startsAt: '20:00',
      endsAt: '21:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0a92c4dc62b74e3ee13',
      name: 'K1 Kick Boxing',
      day: 'Viernes',
      startsAt: '21:00',
      endsAt: '22:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0ad2c4dc62b74e3ee16',
      name: 'K1 Kick Boxing',
      day: 'Lunes',
      startsAt: '21:00',
      endsAt: '22:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '657bf0b32c4dc62b74e3ee19',
      name: 'K1 Kick Boxing',
      day: 'Miércoles',
      startsAt: '21:00',
      endsAt: '22:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
    {
      _id: '658df30b180db6fb70eee1e0',
      activity: {
        _id: '658df2cd180db6fb70eee1dd',
        name: 'Cross funcional',
        __v: 0,
      },
      day: 'Lunes',
      startsAt: '08:00',
      endsAt: '09:00',
      room: 'Salón grande',
      trainer: {
        _id: '656a59a0c1ee5e1a5b530913',
        firstName: 'profe',
        lastName: 'hola',
        email: 'aber@hotmail.com',
        password: '1234567',
        ci: 1244567,
        birthDay: '14/09/23',
        phone: 1244567,
        medService: 'medica',
        classes: [],
        fee: 34563,
        feeHistory: [],
        __v: 0,
      },
      members: [],
      __v: 0,
    },
  ];

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
              state={{ class: onlyClass }}
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
