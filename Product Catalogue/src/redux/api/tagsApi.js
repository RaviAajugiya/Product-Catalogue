import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44364/api/tags/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userData?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Tags"],

  endpoints: (builder) => ({
    getTags: builder.query({
      query: () => ({
        method: "GET",
      }),
      providesTags: ["Tags"],
    }),

    deleteTag: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${id}`
      }),
      invalidatesTags: ["Tags"],
    }),

    addTags: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tags"],
    }),

    assignTags: builder.mutation({
      query: (id) => ({
        method: "POST",
        url: `${id}`,
      }),
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {useDeleteTagMutation, useGetTagsQuery, useAddTagsMutation, useAssignTagsMutation } =
  tagsApi;
