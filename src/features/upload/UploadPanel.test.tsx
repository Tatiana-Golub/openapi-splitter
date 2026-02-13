import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import openApiReducer from '../openapi-splitter/openApiSlice';
import UploadPanel from './UploadPanel';
import type { RootState } from '../../app/store';

describe('UploadPanel', () => {
    function renderWithStore(initialState?: Partial<RootState>) {
        const store = configureStore({
            reducer: { openapi: openApiReducer },
            preloadedState: initialState as RootState,
        });

        return render(
            <Provider store={store}>
                <UploadPanel />
            </Provider>
        );
    }

    test('shows error when textarea is empty and Parse clicked', async () => {
        renderWithStore();
        const parseButton = screen.getByRole('button', { name: /parse/i });
        await userEvent.click(parseButton);

        expect(screen.getByText(/file is empty/i)).toBeInTheDocument();
    });

    test('parses valid OpenAPI YAML', async () => {
        renderWithStore();
        const textarea = screen.getByPlaceholderText(/paste your openapi.yaml here/i);
        const parseButton = screen.getByRole('button', { name: /parse/i });

        const yamlText = `openapi: "3.0.0"
                            paths:
                               /test:
                                 get:
                                   summary: test endpoint
                         `;

        await userEvent.type(textarea, yamlText);
        await userEvent.click(parseButton);

        expect(screen.queryByText(/file is empty/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/not a valid openapi/i)).not.toBeInTheDocument();
    });

    test('shows error for invalid YAML', async () => {
        renderWithStore();
        const textarea = screen.getByPlaceholderText(/paste your openapi.yaml here/i);
        const parseButton = screen.getByRole('button', { name: /parse/i });

        await userEvent.type(textarea, ':::bad yaml:::');
        await userEvent.click(parseButton);

        expect(screen.getByText(/not a valid openapi document/i)).toBeInTheDocument();
    });

    test('handles file upload', async () => {
        renderWithStore();
        const file = new File([`openapi: "3.0.0"`], 'openapi.yaml', { type: 'text/yaml' });

        const input = screen.getByTestId('upload-input') as HTMLInputElement;

        const readAsText = vi.spyOn(FileReader.prototype, 'readAsText');
        const onloadSpy = vi.spyOn(FileReader.prototype, 'onload', 'set');

        await userEvent.upload(input, file);

        expect(readAsText).toHaveBeenCalledWith(file);

        readAsText.mockRestore();
        onloadSpy.mockRestore();
    });

});
