import axios from 'axios';

const createTrainer = async (trainer) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/trainer/`,
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

export default createTrainer;
