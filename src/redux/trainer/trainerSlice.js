import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loadingTrainer: false,
  trainers: [],
  trainer: {},
  errorTrainer: '',
};

const fetchTrainers = createAsyncThunk('trainer/fetchTrainers', () =>
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/trainer`)
    .then((res) => res.data.data),
);

const fetchTrainerById = createAsyncThunk('trainer/fetchTrainerById', (id) =>
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/trainer/${id}`)
    .then((res) => res.data.data),
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
    builder.addCase(fetchTrainerById.pending, (state) => {
      state.loadingTrainer = true;
    });
    builder.addCase(fetchTrainerById.fulfilled, (state, action) => {
      state.loadingTrainer = false;
      state.trainer = action.payload;
      state.errorTrainer = '';
    });
    builder.addCase(fetchTrainerById.rejected, (state, action) => {
      state.loadingTrainer = false;
      state.errorTrainer = action.error.message;
    });
  },
});

export const { reducer: trainersReducer } = trainersSlice;
export { fetchTrainers, fetchTrainerById };
