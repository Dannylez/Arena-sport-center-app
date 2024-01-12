import { configureStore } from '@reduxjs/toolkit';
import { classReducer } from './class/classSlice';
import { membersReducer } from './member/memberSlice';
import { contractsReducer } from './contract/contractSlice';
import { activitiesReducer } from './activity/activitySlice';
import { trainersReducer } from './trainer/trainerSlice';

const store = configureStore({
  reducer: {
    trainer: trainersReducer,
    activity: activitiesReducer,
    class: classReducer,
    member: membersReducer,
    contract: contractsReducer,
  },
});

export default store;
