import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loadingActivity: false,
  activities: [],
  errorActivity: '',
};

const fetchActivities = createAsyncThunk('activity/fetchActivities', () =>
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/activity`)
    .then((res) => res.data.data),
);

const activitiesSlice = createSlice({
  name: 'activity',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchActivities.pending, (state) => {
      state.loadingActivity = true;
    });
    builder.addCase(fetchActivities.fulfilled, (state, action) => {
      state.loadingActivity = false;
      state.activities = action.payload;
      state.errorActivity = '';
    });
    builder.addCase(fetchActivities.rejected, (state, action) => {
      state.loadingActivity = false;
      state.activities = [];
      state.errorActivity = action.error.message;
    });
  },
});

export const { reducer: activitiesReducer } = activitiesSlice;
export { fetchActivities };
