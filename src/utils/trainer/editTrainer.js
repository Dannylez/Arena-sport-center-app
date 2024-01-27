import axios from 'axios';

const editTrainer = async (id, trainer) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/trainer/${id}`,
      trainer,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
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

export default editTrainer;
