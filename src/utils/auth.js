import axios from 'axios';

const login = async (body) => {
  try {
    console.log(process.env.REACT_APP_API_URL);
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/`,
      body,
    );
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
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    return console.error(error.response.data.message);
  }
};

export { login, verifyToken };
