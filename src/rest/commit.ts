import * as T from "../type";
import { request } from "../config";

import { host } from "./utils";

export const commitLast = async (
  repository: { name: string; organization: string },
  token: string,
  branch: string = "master"
): Promise<{ commit: { sha: string } }> => {
  const path = `/repos/${repository.organization}/${repository.name}/branches/${branch}`;

  return request(host + path, token, "GET");
};

export const createBlob = async (
  content: string,
  repository: { name: string; organization: string },
  token: string
): Promise<{ sha: string; url: string }> => {
  const path = `/repos/${repository.organization}/${repository.name}/git/blobs`;

  return request(host + path, token, "POST", { content, encoding: "utf-8" });
};

export const createTree = async (
  base_tree: string,
  tree: T.TreeUnit[],
  repository: { name: string; organization: string },
  token: string
): Promise<{ sha: string; url: string; tree: T.TreeUnit[] }> => {
  const path = `/repos/${repository.organization}/${repository.name}/git/trees`;

  return request(host + path, token, "POST", { base_tree, tree });
};

export const commitCreate = async (
  repository: { name: string; organization: string },
  message: string,
  parentCommitSha: string[],
  treeSha: string,
  token: string
): Promise<{ sha: string }> => {
  const path = `/repos/${repository.organization}/${repository.name}/git/commits`;
  return request(host + path, token, "POST", {
    message,
    parents: parentCommitSha,
    tree: treeSha,
  });
};

export const setRefHead = async (
  repository: { name: string; organization: string },
  sha: string,
  token: string,
  branch: string = "master"
): Promise<{
  node: string;
  object: { sha: string; type: string; url: string };
  ref: string;
  url: string;
}> => {
  const ref = `refs/heads/${branch}`;

  const path = `/repos/${repository.organization}/${repository.name}/git/${ref}`;
  return request(host + path, token, "POST", {
    sha,
    ref,
  });
};

export const getTree = async (
  files: { content: string; path: string }[],
  repo: { name: string; organization: string },
  token: string
): Promise<T.TreeUnit[]> => {
  const p = files.map(async ({ path, content }) => {
    const { sha } = await createBlob(content, repo, token);

    const treeUnit: T.TreeUnit = {
      path,
      mode: "100644",
      type: "blob",
      sha,
    };

    return treeUnit;
  });

  return Promise.all(p);
};

/**
 * this function wraps a few functions and allows to edit a file and make a commit out of it (without intermediate steps required by GH API)
 * @param files: files added/edited
 * @param commitMessage: commit message
 * @param repo: GH repo
 * @param token: GH token
 * @returns
 */
export const commitCreateAll = async (
  files: { content: string; path: string }[],
  commitMessage: string,
  repo: { name: string; organization: string },
  token: string
): Promise<{
  node: string;
  object: { sha: string; type: string; url: string };
  ref: string;
  url: string;
}> => {
  const tree = await getTree(files, repo, token);

  const {
    commit: { sha: commitShaLast },
  } = await commitLast(repo, token);

  const w = await createTree(commitShaLast, tree, repo, token);

  const { sha } = await commitCreate(
    repo,
    commitMessage,
    [commitShaLast],
    w.sha,
    token
  );

  return setRefHead(repo, sha, token);
};
