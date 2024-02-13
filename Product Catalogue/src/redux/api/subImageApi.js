import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subImageApi = createApi({
  reducerPath: "subImageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44364/api/SubImages/",
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
    getImagesByProductId: builder.query({
      query: (id) => ({
        method: "GET",
        url: `${id}`,
      }),
      providesTags: ["SubImage"],
    }),

    addImage: builder.mutation({
      query: ({ id, data }) => ({
        method: "POST",
        body: data,
        url: `${id}`,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }, "SubImage"],
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${id}`,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }, "SubImage"],
    }),
  }),
});

export const {
  useGetImagesByProductIdQuery,
  useAddImageMutation,
  useDeleteImageMutation,
} = subImageApi;
