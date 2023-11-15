import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlProduction } from "@/app/data/dataGeneric";

export const companiesApi = createApi({
  reducerPath: "companies",
  baseQuery: fetchBaseQuery({ baseUrl: urlProduction }),
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => "/companies",
    }),
    getCompaniesById: builder.query({
      query: (id) =>  `/companies/${id}`,
    })
  }),
});

export const { useGetCompaniesQuery, useGetCompaniesByIdQuery } = companiesApi;
