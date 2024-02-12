import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44364/api/Product/",
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().authSlice.userData.data.accessToken;
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    getProduct: builder.query({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${id}`,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useGetProductQuery, useDeleteProductMutation } = productApi;
