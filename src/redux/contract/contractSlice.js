import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_APP_API_URL } from '../../constants';

const initialState = {
  loadingContract: false,
  contracts: [],
  errorContract: '',
};

const fetchContracts = createAsyncThunk('contract/fetchContracts', () =>
  axios.get(`${REACT_APP_API_URL}/api/contract`).then((res) => res.data.data),
);

const contractsSlice = createSlice({
  name: 'contract',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchContracts.pending, (state) => {
      state.loadingContract = true;
    });
    builder.addCase(fetchContracts.fulfilled, (state, action) => {
      state.loadingContract = false;
      state.contracts = action.payload;
      state.errorContract = '';
    });
    builder.addCase(fetchContracts.rejected, (state, action) => {
      state.loadingContract = false;
      state.contracts = [];
      state.errorContract = action.error.message;
    });
  },
});

export const { reducer: contractsReducer } = contractsSlice;
export { fetchContracts };
