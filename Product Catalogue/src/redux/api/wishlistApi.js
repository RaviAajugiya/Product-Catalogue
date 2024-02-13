import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44364/api/Wishlist/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userData.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Wishlist"],

  endpoints: (builder) => ({
    getWishlistProduct: builder.query({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation({
      query: (id) => ({
        method: "POST",
        url: `${id}`,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    deleteWishlist: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${id}`,
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useDeleteWishlistMutation,
  useGetWishlistProductQuery,
  useAddToWishlistMutation,
} = wishlistApi;
