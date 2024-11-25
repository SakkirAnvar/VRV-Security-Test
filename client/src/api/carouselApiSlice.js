// carouselApiSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const carouselApi = createApi({
  reducerPath: "carouselApi",
  baseQuery: baseQuery("media"),
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    getAllCarousels: builder.query({
      query: () => "/getallcarousel",
    }),
    addCarousel: builder.mutation({
      query: (newCarousel) => ({
        url: "/addcarousel",
        method: "POST",
        body: newCarousel,
      }),
    }),
    editCarousel: builder.mutation({
      query: ({ id, updatedCarousel }) => ({
        url: `/editcarousel/${id}`,
        method: "PUT",
        body: updatedCarousel,
      }),
    }),
    deleteCarousel: builder.mutation({
      query: (id) => ({
        url: `/deletecarousel/${id}`,
        method: "DELETE",
      }),
    }),

    getFilteredCarousel: builder.query({
      query: ({ search = "", page = 1, limit = 10 }) => ({
        url: "/getfilteredcarousel",
        params: { search, page, limit },
      }),
    }),
  }),
});

export const {
  useGetAllCarouselsQuery,
  useAddCarouselMutation,
  useEditCarouselMutation,
  useDeleteCarouselMutation,
  useGetFilteredCarouselQuery
} = carouselApi;
