import * as T from "../type";
import { request } from "../config";

import { host } from "./utils";

// the url for the list of containers for a user is slightly different: 
// https://docs.github.com/en/rest/packages#list-packages-for-the-authenticated-users-namespace
const getUrlForPackageList = (organization?:string):string => {
  if (organization) {
    return `/orgs/${organization}/packages`
  }
  
  return '/user/packages'
}

/**
 * see https://docs.github.com/en/rest/reference/packages#list-packages-for-an-organization
 * https://docs.github.com/en/rest/reference/packages#list-packages-for-an-organization--parameters
 * @param organization
 * @param packageType
 * @returns
 */
export const getPackages = (
  packageType: T.PackageTypeEnum,
  token: string,
  organization?: string
) => {
  const path = getUrlForPackageList(organization) + `?package_type=${T.PackageTypeEnum[packageType]}`;

  return request(host + path, token, "GET");
};

/**
 * see https://docs.github.com/en/rest/reference/packages#get-all-package-versions-for-a-package-owned-by-an-organization
 * @param organization
 * @param repo
 * @param dockerName
 * @param token
 * @returns
 */
export const getContainerVersions = async (
  organizationOrUser: "orgs" | "users",
  organization: string,
  repo: string,
  dockerName: string | null,
  packageType: T.PackageTypeEnum,
  token: string
): Promise<any[]> => {
  const name = encodeURIComponent(
    dockerName === null || packageType === T.PackageTypeEnum.npm
      ? repo
      : repo + "/" + dockerName
  );

  const path = [
    organizationOrUser,
    organization,
    "packages",
    T.PackageTypeEnum[packageType],
    name,
    "versions",
  ]
    .map((x) => "/" + x)
    .join("");

  return request<T.ContainerVersion[]>(host + path, token, "GET");
};
