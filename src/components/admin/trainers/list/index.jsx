/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './list.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../../shared/modal';
import { fetchTrainers } from '../../../../redux/trainer/trainerSlice';
import TrainerProfile from '../../../trainers/profile';

function TrainerList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { trainers } = useSelector((state) => state.trainer);
  const { role } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');

  const [trainerModal, setTrainerModal] = useState(false);
  const [trainerId, setTrainerId] = useState('');
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchTrainers());
  }, []);

  useEffect(() => {
    const filtered = trainers.filter((trainer) => {
      const trainerInfo = `${trainer.firstName} ${trainer.lastName} ${trainer.ci}`;
      const includesMemberInfo = trainerInfo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (includesMemberInfo) {
        return true;
      }
      const includesClass = trainer.classes.some((classy) =>
        classy.activity?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return includesClass;
    });
    setFilteredTrainers(filtered);
  }, [trainers, searchTerm]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state?.message);
      setSuccessModal(true);
      setTimeout(async () => {
        setSuccessModal(false);
        setSuccessMessage('');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    console.log(trainerId);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Modal
        isOpen={successModal}
        popUp
        onClose={() => setSuccessModal(false)}
        success
      >
        {successMessage}
      </Modal>
      <Modal
        isOpen={trainerModal}
        onClose={() => setTrainerModal(false)}
        previous={() => setTrainerModal(false)}
      >
        <TrainerProfile id={trainerId} />
      </Modal>
      <h2 className={styles.titleList}>Lista de profesores</h2>
      <div className={styles.list}>
        <div className={styles.divAdd}>
          <div className={styles.divSearch}>
            <label>Buscar:</label>
            <input
              className={styles.searchInput}
              onChange={(e) => {
                handleSearchChange(e);
              }}
              value={searchTerm}
            ></input>
          </div>
          <Link to={'/trainers/form'}>
            <button className={styles.addBtn}>Agregar</button>
          </Link>
        </div>
        <table>
          <thead>
            <tr className={styles.trHead}>
              <th className={styles.th}>Nombre</th>
              <th className={styles.th}>Apellido</th>
              <th className={styles.th}>CI</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.map((trainer) => (
              <tr
                key={trainer?._id}
                className={styles.trList}
                onClick={() => {
                  setTrainerId(trainer?._id);
                  setTrainerModal(true);
                }}
              >
                <td className={styles.td}>{trainer.firstName}</td>
                <td className={styles.td}>{trainer.lastName}</td>
                <td className={styles.td}>{trainer.ci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrainerList;
