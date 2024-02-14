import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import { productApi } from "./api/productApi";
import { authApi } from "./api/authApi";
import { wishlistApi } from "./api/wishlistApi";
import { tagsApi } from "./api/tagsApi";
import { subImageApi } from "./api/subImageApi";
import { pdfApi } from "./api/pdfApi";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [subImageApi.reducerPath]: subImageApi.reducer,
    [pdfApi.reducerPath]: pdfApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      wishlistApi.middleware,
      tagsApi.middleware,
      subImageApi.middleware,
      pdfApi.middleware,
    ]),
});
