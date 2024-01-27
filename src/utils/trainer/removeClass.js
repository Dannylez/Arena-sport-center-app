import axios from 'axios';

const removeClass = async (trainerId, classyId) => {
  try {
    if (trainerId) {
      const trainer = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/trainer/${trainerId}`,
      );
      const trainerClasses = trainer.data.data.classes;
      const newClasses = trainerClasses.filter(
        (clase) => clase._id !== classyId,
      );
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/trainer/${trainerId}`,
        {
          classes: newClasses,
        },
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export default removeClass;
