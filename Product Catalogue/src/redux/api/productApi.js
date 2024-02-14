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
      query: ({ filter, minPrice, maxPrice, search }) => {
        console.log(filter, minPrice, maxPrice, search);

        const queryParams = new URLSearchParams();
        queryParams.append("search", search);
        queryParams.append("minPrice", minPrice);
        filter.forEach((f) => {
          queryParams.append("filter", f);
        });
        queryParams.append("maxPrice", maxPrice);

        console.log(queryParams.toString());

        return {
          method: "GET",
          url: `?${queryParams.toString()}`,
        };
      },
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        method: "GET",
        url: `${id}`,
      }),
      providesTags: ["Product"],
    }),
    getMaxPrice: builder.query({
      query: () => ({
        method: "GET",
        url: `maxPrice`,
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
  useGetMaxPriceQuery,
} = productApi;
