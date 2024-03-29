import axios from 'axios';
import { addMember } from './subscribeMember';

const createMember = async (member) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/member/`,
      member,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (member.classes?.length !== 0) {
      member.classes?.forEach((classy) => {
        addMember(res.data.data, classy);
      });
      /* agregar al alumno al contrato */
    }
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

export default createMember;
