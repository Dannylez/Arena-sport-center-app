/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './list.module.css';
import { fetchMembers } from '../../../redux/member/memberSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../shared/modal';

function MemberList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { members } = useSelector((state) => state.member);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMembers());
    console.log(location);
  }, []);

  useEffect(() => {
    const filtered = members.filter((member) => {
      const memberInfo = `${member.firstName} ${member.lastName} ${member.phone}`;
      const includesMemberInfo = memberInfo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (includesMemberInfo) {
        return true;
      }
      const includesClass = member.classes.some((classy) =>
        classy.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return includesClass;
    });
    setFilteredMembers(filtered);
  }, [members, searchTerm]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessModal(true);
      setTimeout(async () => {
        setSuccessModal(false);
      }, 3000);
    }
  });

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
        {location.state?.message}
      </Modal>
      <h2 className={styles.titleList}>Lista de alumnos</h2>
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
          <Link to={'/members/form'}>
            <button className={styles.addBtn}>Agregar</button>
          </Link>
        </div>
        <table>
          <thead>
            <tr className={styles.trHead}>
              <th className={styles.th}>Nombre</th>
              <th className={styles.th}>Apellido</th>
              <th className={styles.th}>Telefono</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member?._id} className={styles.trList}>
                <td className={styles.td}>{member.firstName}</td>
                <td className={styles.td}>{member.lastName}</td>
                <td className={styles.td}>{member.phone}</td>
                <td className={styles.addTd}>
                  {location.state?.add ? (
                    <Link to={-1}>
                      <button className={styles.addBtn}>+</button>
                    </Link>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberList;
