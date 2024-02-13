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
  tagTypes: ["Product", "SubImage"],

  endpoints: (builder) => ({
    getProduct: builder.query({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        method: "GET",
        url: `${id}`,
      }),
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        body: data,
        url: `${id}`,
      }),
      invalidatesTags: ["Product"],
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
  useGetProductByIdQuery,
  useEditProductMutation,
} = productApi;
