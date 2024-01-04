import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loadingClass: false,
  classes: [],
  onlyClass: {},
  errorClass: '',
};

const fetchClasses = createAsyncThunk('class/fetchClasses', () =>
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/class`)
    .then((res) => res.data.data),
);

const fetchClassById = createAsyncThunk('class/fetchClassById', (id) =>
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/class/${id}`)
    .then((res) => res.data.data),
);

const updateClass = createAsyncThunk('class/updateClass', (toSend) =>
  axios
    .put(`${process.env.REACT_APP_API_URL}/api/class/${toSend.classId}`, {
      members: toSend.newClassMembers,
    })
    .then((res) => res.data.data),
);

const classesSlice = createSlice({
  name: 'class',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchClasses.pending, (state) => {
      state.loadingClass = true;
    });
    builder.addCase(fetchClasses.fulfilled, (state, action) => {
      state.loadingClass = false;
      state.classes = action.payload;
      state.errorClass = '';
    });
    builder.addCase(fetchClasses.rejected, (state, action) => {
      state.loadingClass = false;
      state.classes = [];
      state.errorClass = action.error.message;
    });
    builder.addCase(fetchClassById.pending, (state) => {
      state.loadingClass = true;
    });
    builder.addCase(fetchClassById.fulfilled, (state, action) => {
      state.loadingClass = false;
      state.onlyClass = action.payload;
      state.errorClass = '';
    });
    builder.addCase(fetchClassById.rejected, (state, action) => {
      state.loadingClass = false;
      state.onlyClass = [];
      state.errorClass = action.error.message;
    });
    builder.addCase(updateClass.pending, (state) => {
      state.loadingClass = true;
    });
    builder.addCase(updateClass.fulfilled, (state, action) => {
      state.loadingClass = false;
      state.errorClass = '';
    });
    builder.addCase(updateClass.rejected, (state, action) => {
      state.loadingClass = false;
      state.errorClass = action.error.message;
    });
  },
});

export const { reducer: classReducer } = classesSlice;
export { fetchClasses, fetchClassById, updateClass };
