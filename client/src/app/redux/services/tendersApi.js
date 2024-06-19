import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlProduction } from "@/app/data/dataGeneric";

export const tendersApi = createApi({
  reducerPath: "tenders",
  baseQuery: fetchBaseQuery({ baseUrl: urlProduction }),
  endpoints: (builder) => ({
    getTenders: builder.query({
      query: () => "/tenders",
    }),
    getTenderid: builder.query({
      query: (id) => "/tenders",
    }),
    getTenderById: builder.query({
      query: (id) => `/tenders/${id}`,
    })
  }),
});

export const { useGetTendersQuery,useGetTenderidQuery, useGetTenderByIdQuery} = tendersApi;

