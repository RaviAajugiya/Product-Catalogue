import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44364/api/Product/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userData?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    getProduct: builder.query({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
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

export const {
  useGetProductQuery,
  useDeleteProductMutation,
  useAddProductMutation,
} = productApi;
