import { configureStore } from '@reduxjs/toolkit';
import openApiReducer from "../features/openapi-splitter/openapiSlice"

export const store = configureStore({
  reducer: {
    openapi: openApiReducer
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;