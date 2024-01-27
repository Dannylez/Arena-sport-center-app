import axios from 'axios';

const addClass = async (trainerId, classyId) => {
  try {
    const trainer = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/trainer/${trainerId}`,
    );
    const trainerClasses = trainer.data.data.classes;
    if (!trainerClasses.some((clase) => clase._id === classyId)) {
      trainerClasses.push(classyId);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/trainer/${trainerId}`,
        {
          classes: trainerClasses,
        },
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export default addClass;
