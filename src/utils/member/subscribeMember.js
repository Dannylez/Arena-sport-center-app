import axios from 'axios';
import { REACT_APP_API_URL } from '../../constants';

const addMember = async (member, classy) => {
  const memberId = member._id;
  const classId = classy._id;
  const classMembers = [...classy.members, memberId];
  try {
    await axios.put(`${REACT_APP_API_URL}/api/class/${classId}`, {
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
    await axios.put(`${REACT_APP_API_URL}/api/member/${memberId}`, {
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
