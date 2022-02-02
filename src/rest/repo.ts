import * as T from "../type";
import { request } from "../config";

import { host } from "./utils";

/**
 * https://docs.github.com/en/rest/reference/repos#create-a-repository-using-a-template
 * @param template
 * @param repository: https://docs.github.com/en/rest/reference/repos#create-a-repository-using-a-template--parameters
 * @param token
 * @returns
 */
export const cloneFromTemplate = (
  template: { organization: string; repo: string },
  repository: {
    name: string;
    organization?: string;
    private?: boolean;
    description?: string;
  },
  token: string
) => {
  const path = `/repos/${template.organization}/${template.repo}/generate`;

  return request(host + path, token, "POST", {
    name: repository.name,
    owner: repository.organization,
    private: repository.private,
    description: repository.description,
  });
};

export const releaseCreate = async (
  organization: string,
  repo: string,
  tag_name: string,
  token: string,
  name?: string
) => {
  const path = `/repos/${organization}/${repo}/releases`;

  const r = await request<T.ContainerVersion[]>(host + path, token, "POST", {
    tag_name,
    name,
  });

  return r;
};

export const update = async (
  data: { description?: string },
  organization: string,
  repo: string,
  token: string
) => {
  const path = `/repos/${organization}/${repo}`;

  if (Object.keys(data).length === 0) {
    throw Error("data object empty, aborting");
  }

  const r = await request<T.ContainerVersion[]>(
    host + path,
    token,
    "PATCH",
    data
  );

  return r;
};
