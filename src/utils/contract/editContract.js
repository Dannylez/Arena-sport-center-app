import axios from 'axios';

const editContract = async (id, classy) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/contract/${id}`,
      classy,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
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

export default editContract;
