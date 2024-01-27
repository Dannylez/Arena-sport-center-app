import axios from 'axios';

const removeMember = async (member, classy) => {
  const memberId = member._id;
  const classId = classy._id;
  const classMembers = classy.members;
  const newClassMembers = classMembers.filter(
    (member) => member._id !== memberId,
  );
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/class/${classId}`, {
      members: newClassMembers,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

const removeClass = async (member, classy) => {
  const memberId = member._id;
  const classId = classy._id;
  const memberClasses = member.classes;
  const newMemberClasses = memberClasses.filter(
    (classy) => classy._id !== classId,
  );
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
      classes: newMemberClasses,
    });
    return true;
  } catch (error) {
    throw error;
  }
};

const unsubscribeMember = async (member, classy) => {
  try {
    await removeMember(member, classy);
    await removeClass(member, classy);
  } catch (error) {
    console.error('Error: ', error);
  }
};

export { unsubscribeMember, removeMember, removeClass };
