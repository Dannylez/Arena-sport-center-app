import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loadingAuth: false,
  user: '',
  role: '',
};

const verifyUser = createAsyncThunk('auth/verifyUser', async (token) => {
  try {
    if (token) {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res) {
        return res.data?.message;
      }
    }
  } catch (error) {
    console.error(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(verifyUser.pending, (state) => {
      state.loadingAuth = true;
    });
    builder.addCase(verifyUser.fulfilled, (state, action) => {
      state.loadingAuth = false;
      state.user = action.payload?.sub;
      state.role = action.payload?.role;
    });
    builder.addCase(verifyUser.rejected, (state) => {
      state.loadingAuth = false;
      state.user = '';
      state.role = '';
    });
  },
});

export const { reducer: authReducer } = authSlice;
export { verifyUser };
