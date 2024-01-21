import axios from 'axios';
import { REACT_APP_API_URL } from '../constants';

const login = async (body) => {
  try {
    const res = await axios.post(`${REACT_APP_API_URL}/api/auth/`, body);
    if (res.data) {
      localStorage.setItem('token', res.data?.message);
      return 'Sesión iniciada';
    }
    return 'Email o contraseña incorrectos';
  } catch (error) {
    return console.error(error.response.data.message);
  }
};

const verifyToken = async (token) => {
  try {
    const res = await axios.get(`${REACT_APP_API_URL}/api/auth/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    return console.error(error.response.data.message);
  }
};

export { login, verifyToken };
