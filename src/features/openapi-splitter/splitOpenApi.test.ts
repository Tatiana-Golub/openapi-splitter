import { describe, test, expect } from "vitest";
import { splitOpenApi } from "./splitOpenApi";
import type { DirectoryNode } from "../../entities/file-system/types";

describe("splitOpenApi", () => {
    test("splits a valid OpenAPI spec into a file tree", () => {
        const yamlText = `
openapi: "3.0.0"
info:
  title: Sample API
  version: "1.0"
paths:
  /users:
    get:
      summary: Get users
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
`;

        const tree: DirectoryNode = splitOpenApi(yamlText);

        expect(tree.type).toBe("directory");
        expect(tree.name).toBe("root");
        expect(tree.children.length).toBeGreaterThan(0);

        const openapiFile = tree.children.find(f => f.type === "file" && f.name === "openapi.yaml");
        expect(openapiFile).toBeDefined();
        if (openapiFile?.type === "file") {
            expect(openapiFile.content).toContain("openapi: 3.0.0");
            expect(openapiFile.content).toContain("info:");
        }

        const pathsDir = tree.children.find(
            f => f.type === "directory" && f.name === "paths"
        );
        expect(pathsDir).toBeDefined();

        if (pathsDir?.type === "directory") {
            const usersFile = pathsDir.children.find(
                f => f.type === "file" && f.name === "users.yaml"
            );
            expect(usersFile).toBeDefined();
            if (usersFile?.type === "file") {
                expect(usersFile.content).toContain("get:");
                expect(usersFile.content).toContain("summary: Get users");
            }
        }

        const componentsDir = tree.children.find(f => f.type === "directory" && f.name === "components");
        expect(componentsDir).toBeDefined();
    });

    test("throws error for invalid YAML", () => {
        const invalidYaml = `
openapi: "3.0.0
paths:
  /users: {}
`;

        expect(() => splitOpenApi(invalidYaml)).toThrow("Invalid YAML format");
    });

    test("throws error for YAML that is not OpenAPI", () => {
        const notOpenApiYaml = `
foo: bar
baz:
  - a
  - b
`;

        expect(() => splitOpenApi(notOpenApiYaml)).toThrow("Not a valid OpenAPI document");
    });
});
