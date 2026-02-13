import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore, type Action, type Reducer } from "@reduxjs/toolkit";
import FileTree from "../FileTree/FileTree";
import * as downloadZipModule from "../../openapi-splitter/lib/downloadZip";
import type { DirectoryNode } from "../../../entities/file-system/types";
import openApiReducer, { type OpenApiState } from '../../openapi-splitter/openApiSlice';

type RootState = {
  openapi: OpenApiState;
};

export function renderWithStore(initialState?: Partial<RootState>) {
    const store = configureStore<RootState>({
        reducer: { openapi: openApiReducer as Reducer<OpenApiState, Action> },
        preloadedState: initialState as RootState
    });

    return {
        ...render(
            <Provider store={store}>
                <FileTree />
            </Provider>
        ),
        store
    };
}

const sampleTree: DirectoryNode = {
    type: "directory",
    name: "root",
    path: "",
    children: [
        { type: "file", name: "file1.yaml", path: "file1.yaml", content: "content1" },
        {
            type: "directory",
            name: "subdir",
            path: "subdir",
            children: [
                { type: "file", name: "file2.yaml", path: "subdir/file2.yaml", content: "content2" }
            ]
        }
    ]
};

describe("FileTree component", () => {
    test("renders empty state when no tree", () => {
        renderWithStore();
        expect(screen.getByText(/no files yet/i)).toBeInTheDocument();
    });

    test("renders files and folders", () => {
        renderWithStore({ openapi: { tree: sampleTree, selectedFilePath: null, error: null } });

        expect(screen.getByText(/file1\.yaml/i)).toBeInTheDocument();
        expect(screen.getByText(/subdir/i)).toBeInTheDocument();
        expect(screen.getByText(/file2\.yaml/i)).toBeInTheDocument();
    });

    test("selects file when clicked", async () => {
        const { store } = renderWithStore({ openapi: { tree: sampleTree, selectedFilePath: null, error: null } });

        const fileNode = screen.getByText(/file1\.yaml/i);
        await userEvent.click(fileNode);

        const state = store.getState();
        expect(state.openapi.selectedFilePath).toBe("file1.yaml");
    });

    test("calls downloadZip when button clicked", async () => {
        const spy = vi.spyOn(downloadZipModule, "downloadZip").mockImplementation(async () => { });

        renderWithStore({ openapi: { tree: sampleTree, selectedFilePath: null, error: null } });

        const button = screen.getByRole("button", { name: /download zip/i });
        await userEvent.click(button);

        expect(spy).toHaveBeenCalledWith(sampleTree);

        spy.mockRestore();
    });
});
