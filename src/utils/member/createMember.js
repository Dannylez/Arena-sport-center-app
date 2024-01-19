import axios from 'axios';
import { REACT_APP_API_URL } from '../../constants';

const createMember = async (member) => {
  try {
    const res = await axios.post(`${REACT_APP_API_URL}/api/member/`, member, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de estado diferente de 2xx
      return error.response.data.message;
    } else if (error.request) {
      // La solicitud se hizo, pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Algo más causó un error
      console.error('Error:', error.message);
    }
  }
};

export default createMember;
