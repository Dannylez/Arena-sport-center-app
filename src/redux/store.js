import { configureStore } from '@reduxjs/toolkit';
import { classReducer } from './class/classSlice';
import { membersReducer } from './member/memberSlice';
import { contractsReducer } from './contract/contractSlice';

const store = configureStore({
  reducer: {
    class: classReducer,
    member: membersReducer,
    contract: contractsReducer,
  },
});

export default store;
