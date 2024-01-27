import axios from 'axios';

const addMember = async (member, classy) => {
  try {
    let classId, classMembers;
    if (Object.prototype.toString.call(classy) === '[object String]') {
      const clase = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/class/${classy}`,
      );
      classId = clase.data.data._id;
      classMembers = clase.data.data.members;
      classMembers.push(member._id);
    } else {
      classId = classy._id;
      classMembers = classy.members;
      classMembers.push(member._id);
    }

    await axios.put(`${process.env.REACT_APP_API_URL}/api/class/${classId}`, {
      members: classMembers,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

const addClass = async (member, classy) => {
  const memberId = member._id;
  const classId = classy._id;
  const memberClasses = [...member.classes, classId];
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
      classes: memberClasses,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

const subscribeMember = async (member, classy) => {
  try {
    await addMember(member, classy);
    await addClass(member, classy);
  } catch (error) {
    console.error('Error: ', error);
  }
};

export { subscribeMember, addClass, addMember };
