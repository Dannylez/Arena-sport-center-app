import axios from 'axios';
import { addMember } from './subscribeMember';
import { removeMember } from './unsubscribeMember';

const editMember = async (id, member) => {
  try {
    const oldMember = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/member/${id}`,
    );
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/member/${id}`,
      member,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (member.classes?.length !== 0) {
      member.classes?.forEach((classy) => {
        if (!oldMember.classes?.some((item) => item._id === classy._id)) {
          addMember(res.data.data, classy);
        }
      });
    }

    if (oldMember.classes?.length !== 0) {
      oldMember.classes?.forEach((classy) => {
        if (!member.classes.some((item) => item._id === classy._id)) {
          removeMember(res.data.data, classy);
        }
      });
    }
    /* agregar al alumno al contrato */
    return res;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error:', error.message);
    }
  }
};

export default editMember;
