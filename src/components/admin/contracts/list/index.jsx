/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './list.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../../shared/modal';
import { fetchContracts } from '../../../../redux/contract/contractSlice';

function ContractList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { contracts } = useSelector((state) => state.contract);
  const { role } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredContracts, setFilteredContracts] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchContracts());
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
      const includesContract = contract.classes.some((classy) =>
        classy.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return includesContract;
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
          <Link to={'/contracts/form'}>
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
            {filteredContracts.map((contract) => (
              <tr
                key={contract?._id}
                className={styles.trList}
                onClick={() =>
                  navigate('./form', { state: { id: contract?._id } })
                }
              >
                <td className={styles.td}>{contract.firstName}</td>
                <td className={styles.td}>{contract.lastName}</td>
                <td className={styles.td}>{contract.ci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContractList;
