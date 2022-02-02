import { request } from "../config";

import { host } from "./utils";

export const getFile = async (
  filePath: string,
  repo: { name: string; organization: string },
  token: string
): Promise<{ content: string }> => {
  const path = `/repos/${repo.organization}/${repo.name}/contents/${filePath}`;

  return request(host + path, token, "GET");
};

export const getFileString = async (
  filePath: string,
  repo: { name: string; organization: string },
  token: string
): Promise<string> => {
  const file = await getFile(filePath, repo, token);

  const buf = Buffer.from(file.content, "base64");
  return buf.toString("utf8");
};
