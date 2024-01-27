import axios from 'axios';
import removeClass from '../trainer/removeClass';
import addClass from '../trainer/addClass';

const editClass = async (id, classy) => {
  try {
    const oldClass = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/class/${id}`,
    );
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/class/${id}`,
      classy,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const newClass = res.data.data;
    if (oldClass.data.data.trainer?._id !== newClass.trainer?._id) {
      removeClass(oldClass.data.data.trainer?._id, id);
      addClass(newClass.trainer?._id, id);
    }
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

export default editClass;
