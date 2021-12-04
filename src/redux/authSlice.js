import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as apiCalls from "../api/apiCalls";

export const loginUser = createAsyncThunk(
  "/api/1.0/login",
  async (user, thunkApi) => {
    try {
      const response = await apiCalls.login(user);
      if (response.status === 200) {
        return { ...response.data, password: user.password };
      } else {
        return thunkApi.rejectWithValue(response.data);
      }
    } catch (e) {
      return thunkApi.rejectWithValue(e.response.data);
    }
  }
);

export const signupUser = createAsyncThunk(
  "/api/1.0/signup",
  async (user, thunkApi) => {
    try {
      const response = await apiCalls.signup(user);
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkApi.rejectWithValue(response.data);
      }
    } catch (e) {
      return thunkApi.rejectWithValue(e.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errors: {},
  user: {
    id: 0,
    displayName: "",
    username: "",
    image: "",
    password: "",
    isLoggedIn: false,
  },
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.errors = {};
      return state;
    },
    logout: (state) => {
      state = initialState;
      return state;
    },
    updateUser: (state, { payload }) => {
      state.user.displayName = payload.displayName;
      state.user.image = payload.image;
      return state;
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload;
      state.user.isLoggedIn = true;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errors = payload;
    },
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [signupUser.fulfilled]: (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    },
    [signupUser.pending]: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.errors = payload;
    },
  },
});

export const { clearState, logout, updateUser } = authSlice.actions;

export const authSelector = (state) => state.authentication;
