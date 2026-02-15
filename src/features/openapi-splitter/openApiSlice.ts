import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DirectoryNode } from '../../entities/file-system/types';

export interface OpenApiState {
  tree: DirectoryNode | null;
  selectedFilePath: string | null;
  error: string | null;
}

const initialState: OpenApiState = {
  tree: null,
  selectedFilePath: null,
  error: null
};

const openApiSlice = createSlice({
  name: 'openapi',
  initialState,
  reducers: {
    setTree(state, action: PayloadAction<DirectoryNode>) {
      state.tree = action.payload;
      state.selectedFilePath = null;
      state.error = null;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.tree = null;
      state.selectedFilePath = null;
    },

    clearError(state) {
      state.error = null;
    },

    resetState(state) {
      state.tree = null;
      state.selectedFilePath = null;
      state.error = null;
    },

    setSelectedFile(state, action: PayloadAction<string>) {
      state.selectedFilePath = action.payload;
    }
  }
});

export const {
  setTree,
  setError,
  clearError,
  setSelectedFile,
  resetState
} = openApiSlice.actions;

export default openApiSlice.reducer;