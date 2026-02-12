import yaml from "js-yaml";
import type { DirectoryNode } from "../../entities/file-system/types";
import { buildTree } from "../../entities/file-system/buildTree";

interface OpenApiSpec {
  openapi: string;
  paths: Record<string, unknown>;
  components?: Record<string, Record<string, unknown>>;
  [key: string]: unknown;
}

type VirtualFile = {
  path: string;
  content: string;
};

function isOpenApiSpec(obj: unknown): obj is OpenApiSpec {
  if (!obj || typeof obj !== 'object') return false;

  const spec = obj as Record<string, unknown>;

  return (
    typeof spec.openapi === 'string' &&
    typeof spec.paths === 'object' &&
    spec.paths !== null
  );
}

export function splitOpenApi(text: string): DirectoryNode {
  let parsed: unknown;

  try {
    parsed = yaml.load(text);
  } catch {
    throw new Error('Invalid YAML format');
  }

  if (!isOpenApiSpec(parsed)) {
    throw new Error('Not a valid OpenAPI document');
  }

  const spec = parsed;
  const { paths, components, ...root } = spec;

  const files: VirtualFile[] = [];

  files.push({
    path: 'openapi.yaml',
    content: yaml.dump(root)
  });

  Object.entries(paths).forEach(([apiPath, value]) => {
    const cleanPath = apiPath.startsWith('/')
      ? apiPath.slice(1)
      : apiPath;

    const segments = cleanPath.split('/');
    const fileName = segments.pop() + '.yaml';
    const fullPath = ['paths', ...segments, fileName].join('/');

    files.push({
      path: fullPath,
      content: yaml.dump({ [apiPath]: value })
    });
  });

  if (components) {
    Object.entries(components).forEach(([type, group]) => {
      if (!group || typeof group !== 'object') return;

      Object.entries(group).forEach(([name, value]) => {
        files.push({
          path: `components/${type}/${name}.yaml`,
          content: yaml.dump(value)
        });
      });
    });
  }

  return buildTree(files);
}