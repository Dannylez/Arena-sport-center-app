/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './list.module.css';
import { fetchMembers } from '../../../redux/member/memberSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../shared/modal';
import { subscribeMember } from '../../../utils/member/subscribeMember';

function MemberList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { members } = useSelector((state) => state.member);
  const { role } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMembers());
    if (role === 'ADMIN') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const filtered = members.filter((member) => {
      const memberInfo = `${member.firstName} ${member.lastName} ${member.ci}`;
      const includesMemberInfo = memberInfo.toLowerCase().includes(searchTerm);
      const includesClass = member.classes.some((classy) =>
        classy.activity.name?.toLowerCase().includes(searchTerm),
      );
      return includesMemberInfo || includesClass;
    });
    setFilteredMembers(filtered);
  }, [members, searchTerm]);

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
    if (typeof e.target.value === 'string') {
      setSearchTerm(e.target.value.toLowerCase());
    } else {
      setSearchTerm(e.target.value);
    }
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
          <Link to={'/members/form'} state={{ class: location.state?.class }}>
            <button className={styles.addBtn}>Agregar</button>
          </Link>
        </div>
        <table>
          <thead>
            <tr className={styles.trHead}>
              <th className={styles.th}>Nombre</th>
              <th className={styles.th}>Apellido</th>
              <th className={styles.th}>CI</th>
              <th className={styles.thEmpty}></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member?._id}
                className={styles.trList}
                onClick={() =>
                  navigate('./form', { state: { id: member?._id } })
                }
              >
                <td className={styles.td}>{member.firstName}</td>
                <td className={styles.td}>{member.lastName}</td>
                <td className={styles.td}>{member.ci}</td>
                <td className={styles.addTd}>
                  {location.state?.class ? (
                    <button
                      className={styles.addBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        subscribeMember(member, location.state?.class);
                        navigate('/schedule', {
                          state: {
                            class: location.state?.class,
                            message: 'Alumno registrado',
                          },
                        });
                      }}
                    >
                      +
                    </button>
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
