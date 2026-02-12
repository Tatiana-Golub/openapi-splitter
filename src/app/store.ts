import { configureStore } from "@reduxjs/toolkit";
import openapiReducer from "../features/openapi-splitter/openapiSlice"

export const store = configureStore({
  reducer: {
    openapi: openapiReducer
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;