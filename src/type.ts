interface FileNode {
  name: string;
  url: string;
  updatedAt: string;
}

export interface TreeUnit {
  path: string;
  mode: string;
  type: string;
  sha: string;
}

export interface VersionNode {
  id: string;
  version: string;
  files: {
    nodes: FileNode[];
  };
}

export interface PackageNode {
  id: string;
  name: string;
  packageType: string;
  versions: {
    nodes: VersionNode[];
  };
}

export interface PackageVersionResponse {
  data: {
    repository: {
      packages: {
        nodes: PackageNode[];
      };
    };
  };
}

interface Owner {
  login: string;
  id: number;
}

type Language = "JavaScript";

export type PackageType = "container" | "npm" | "docker";

export enum PackageTypeEnum {
  container = 1,
  npm = 2,
}

export interface Repo {
  id: number;
  name: string;
  owner: Owner;
  private: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: Language;
}

export interface ContainerVersion {
  id: number;
  name: string;
  url: string;
  package_html_url: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  metadata: { package_type: PackageType; container?: { tags: string[] } };
}
