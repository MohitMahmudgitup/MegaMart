import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// const baseURL = process.env.NEXT_PUBLIC_BASE_API;
// console.log(process.env.NEXT_PUBLIC_BASE_API);

const baseURL =
  process.env.NEXT_PUBLIC_BASE_API 

// const baseURL =
//   process.env.NEXT_PUBLIC_BASE_API ||
//   'https://mega-mart-base-backend.vercel.app/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // Use Bearer
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["Customer"],
});
