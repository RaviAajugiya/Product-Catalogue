import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pdfApi = createApi({
  reducerPath: "pdfApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44364/api/Pdf/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userData?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getPdf: builder.mutation({
      query: () => ({
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPdfMutation } = pdfApi;
