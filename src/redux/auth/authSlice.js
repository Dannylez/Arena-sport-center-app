import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyToken } from '../../utils/auth';

const initialState = {
  loadingAuth: false,
  user: '',
  role: '',
};

const token = localStorage.getItem('token');

const verifyUser = createAsyncThunk('auth/verifyUser', async () => {
  try {
    const res = await verifyToken(token);
    if (res) {
      console.log(res.data?.message);
      return res.data?.message;
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
