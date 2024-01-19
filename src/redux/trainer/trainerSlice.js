import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_APP_API_URL } from '../../constants';

const initialState = {
  loadingTrainer: false,
  trainers: [],
  errorTrainer: '',
};

const fetchTrainers = createAsyncThunk('trainer/fetchTrainers', () =>
  axios.get(`${REACT_APP_API_URL}/api/trainer`).then((res) => res.data.data),
);

const trainersSlice = createSlice({
  name: 'trainer',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTrainers.pending, (state) => {
      state.loadingTrainer = true;
    });
    builder.addCase(fetchTrainers.fulfilled, (state, action) => {
      state.loadingTrainer = false;
      state.trainers = action.payload;
      state.errorTrainer = '';
    });
    builder.addCase(fetchTrainers.rejected, (state, action) => {
      state.loadingTrainer = false;
      state.trainers = [];
      state.errorTrainer = action.error.message;
    });
  },
});

export const { reducer: trainersReducer } = trainersSlice;
export { fetchTrainers };
