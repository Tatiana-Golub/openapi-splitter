import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import openApiReducer from '../openapi-splitter/openApiSlice';
import Viewer from './Viewer';
import type { DirectoryNode } from '../../entities/file-system/types';
import type { RootState } from '../../app/store';

describe('Viewer component', () => {
  function renderWithStore(initialState?: Partial<RootState>) {
    const store = configureStore({
      reducer: { openapi: openApiReducer },
      preloadedState: initialState as RootState,
    });

    return render(
      <Provider store={store}>
        <Viewer />
      </Provider>
    );
  }

  test('shows empty message when no file is selected', () => {
    renderWithStore({ openapi: { tree: null, selectedFilePath: null, error: null } });
    expect(screen.getByText(/select a file to preview/i)).toBeInTheDocument();
  });

  test('shows error message when file is not found', () => {
    const tree: DirectoryNode = {
      type: 'directory',
      name: 'root',
      path: '/',
      children: [],
    };

    renderWithStore({ openapi: { tree, selectedFilePath: '/nonexistent.yaml', error: null } });
    expect(screen.getByText(/file not found/i)).toBeInTheDocument();
  });

  test('renders file content when file is selected', () => {
    const tree: DirectoryNode = {
      type: 'directory',
      name: 'root',
      path: '/',
      children: [
        {
          type: 'file',
          name: 'test.yaml',
          path: '/test.yaml',
          content: 'key: value',
        },
      ],
    };

    renderWithStore({ openapi: { tree, selectedFilePath: '/test.yaml', error: null } });

    expect(screen.getByText('/test.yaml')).toBeInTheDocument();

    const pre = screen.getByText(/key/i).closest('pre');
    expect(pre).toHaveTextContent('key: value');
  });
});
