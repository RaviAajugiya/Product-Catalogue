import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import { productApi } from "./api/productApi";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productApi.middleware, authApi.middleware]),
});
