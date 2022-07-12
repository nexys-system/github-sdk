import * as T from "./type";
import { request } from "./config";

class GithubQL {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  graphQLRequest = async <A>(query: any): Promise<A> => {
    const data = { query };
    const url = "https://api.github.com/graphql";

    return request(url, this.token, "POST", data);
  };

  /**
   *
   * @param owner (organization)
   * @param name repo name
   * @returns list of packages
   */
  getVersions = async (owner: string, name: string): Promise<T.PackageNode> => {
    const n = 100;
    //
    const m = 10;
    // last ten versions (note last is actually first in the api)
    const v = 10;

    const query = `query {
      repository(owner:"${owner}", name:"${name}") { 
        packages(first:${n}){
          nodes {
            id
            name
            packageType 
            versions(first:${v}) {
              nodes {
                id
                version
                files(first:${m}) {
                  nodes {
                    name
                    url
                    updatedAt
                  }
                }
              }
            }
          }
        }
      }
    }`;

    // console.log(query);

    const { data } = await this.graphQLRequest<T.PackageVersionResponse>(query);

    //  console.log(JSON.stringify(data, null, 2));

    if (!data.repository) {
      console.log(data);
      throw Error("no package");
    }

    const packages = data.repository.packages.nodes;

    // array length should equal 1, because we filter by repo name
    if (packages.length > 0) {
      console.log(packages);
      const fPackages = packages
        .filter((x) => x.packageType === "NPM")
        // when a package is deleted it seems it is not fully deleted in the API, so filtering out with the following
        .filter((x) => !x.name.includes("deleted"))

      const fLength = fPackages.length;

      if (fLength > 1) {
        console.warn("found more than one package type");
      }
      return fPackages[fLength - 1];
    }

    throw Error("packages could not be found");
  };

  packageById = async (
    owner: string,
    name: string,
    id: string
  ): Promise<T.VersionNode> => {
    const myPackage = await this.getVersions(owner, name);

    const version = myPackage.versions.nodes.find((x) => x.id === id);

    if (!version) {
      throw Error("version could not be found");
    }

    return version;
  };
}

export default GithubQL;
