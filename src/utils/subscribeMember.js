import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const addMember = async (member, classy) => {
  const memberId = member._id;
  const classId = classy._id;
  const classMembers = [...classy.members, memberId];
  try {
    await axios.put(`${url}/api/class/${classId}`, {
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
    await axios.put(`${url}/api/member/${memberId}`, {
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

export default subscribeMember;
