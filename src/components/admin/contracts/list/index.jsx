/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './list.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../../shared/modal';
import { fetchContracts } from '../../../../redux/contract/contractSlice';
import { fetchMembers } from '../../../../redux/member/memberSlice';

function ContractList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { contracts } = useSelector((state) => state.contract);
  const { members } = useSelector((state) => state.member);
  const { role } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredContracts, setFilteredContracts] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const howManyMembers = (id) => {
    if (members.length !== 0) {
      const list = members.filter((member) =>
        member.contracts.some((cont) => cont._id === id),
      );
      return list.length;
    }
  };

  useEffect(() => {
    dispatch(fetchContracts());
    dispatch(fetchMembers());
  }, []);

  useEffect(() => {
    const filtered = contracts.filter((contract) => {
      const contractInfo = `${contract.name} ${contract.activity.name} ${contract.price}`;
      const includesMemberInfo = contractInfo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (includesMemberInfo) {
        return true;
      }
    });
    setFilteredContracts(filtered);
  }, [contracts, searchTerm]);

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
      <h2 className={styles.titleList}>Lista de contratos</h2>
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
          <Link to={'/contracts/form'}>
            <button className={styles.addBtn}>Agregar</button>
          </Link>
        </div>
        {filteredContracts.map((contract) => (
          <div
            key={contract._id}
            className={styles.card}
            onClick={() => navigate('./form', { state: { id: contract?._id } })}
          >
            <h3 className={styles.contractInfo}>
              {contract.name}. ({contract.activity.name})
            </h3>
            <p className={styles.contractP}>{contract.description}</p>
            <div className={styles.contractPInfo}>
              <p>Alumnos: {howManyMembers(contract._id)}</p>
              <p>${contract.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContractList;
