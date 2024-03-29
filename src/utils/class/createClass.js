import axios from 'axios';
import addClass from '../trainer/addClass';

const createClass = async (classy) => {
  try {
    const trainer = classy.trainer;
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/class/`,
      classy,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    await addClass(trainer, res.data.data._id);
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

export default createClass;
