import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_APP_API_URL } from '../../constants';

const initialState = {
  loadingMember: false,
  members: [],
  member: {},
  errorMember: '',
};

const fetchMembers = createAsyncThunk('member/fetchMembers', () =>
  axios.get(`${REACT_APP_API_URL}/api/member`).then((res) => res.data.data),
);

const fetchMemberById = createAsyncThunk('member/fetchMemberById', (id) =>
  axios
    .get(`${REACT_APP_API_URL}/api/member/${id}`)
    .then((res) => res.data.data),
);

const membersSlice = createSlice({
  name: 'member',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMembers.pending, (state) => {
      state.loadingMember = true;
    });
    builder.addCase(fetchMembers.fulfilled, (state, action) => {
      state.loadingMember = false;
      state.members = action.payload;
      state.errorMember = '';
    });
    builder.addCase(fetchMembers.rejected, (state, action) => {
      state.loadingMember = false;
      state.members = [];
      state.errorMember = action.error.message;
    });
    builder.addCase(fetchMemberById.pending, (state) => {
      state.loadingMember = true;
    });
    builder.addCase(fetchMemberById.fulfilled, (state, action) => {
      state.loadingMember = false;
      state.member = action.payload;
      state.errorMember = '';
    });
    builder.addCase(fetchMemberById.rejected, (state, action) => {
      state.loadingMember = false;
      state.errorMember = action.error.message;
    });
  },
});

export const { reducer: membersReducer } = membersSlice;
export { fetchMembers, fetchMemberById };
