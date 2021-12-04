import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import {
  localStorageMiddleware,
  reHydrateStore,
} from "./localStorageMiddleware";

export default configureStore({
  reducer: {
    authentication: authSlice.reducer,
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
