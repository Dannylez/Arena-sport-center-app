import axios from 'axios';

const addTrainer = async (trainer, classy) => {
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/class/${classy}`, {
      trainer: trainer,
    });

    /* let classId, classTrainer;
      if (Object.prototype.toString.call(classy) === '[object String]') {
        const clase = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/class/${classy}`,
        );
        classId = classy;
        classTrainer = clase.data.data.trainer;
        classTrainer.push(trainer._id);
      } else {
        classId = classy._id;
        classTrainer = classy.trainers;
        classTrainer.push(trainer._id);
      }
  
      await axios.put(`${process.env.REACT_APP_API_URL}/api/class/${classId}`, {
        trainers: classTrainer,
      }); */
    return true;
  } catch (error) {
    throw error;
  }
};

export default addTrainer;
